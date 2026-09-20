"""Builds public/tryon/grill-upper.glb — the try-on grill — from public/dental_cast.glb.

The cast is a 68MB / 2.5M-triangle scan of a full upper arch. This crops it to the
outward-facing surface of the front eight crowns, levels the bite plane, turns the
teeth to point down with the origin at the middle of the incisal edge (front surface
at z = 0, x right, y up, z forward, centimetres), decimates by vertex clustering,
smooths away scan noise and writes a ~0.9MB GLB.

The crop constants (C, MID, TH0/TH1, YCUT) were read off this specific scan; a
different cast needs new ones.

Source: "Dental Cast" by Nancy/Lanzi Luo, CC-BY-4.0 — attribution is required.

    python3 scripts/build_tryon_grill.py      (needs numpy)
"""
import json,os,struct,sys
import numpy as np
HERE=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.join(HERE,'..','public','dental_cast.glb')
OUT=os.path.join(HERE,'..','public','tryon','grill-upper.glb')
def load():
    f=open(SRC,'rb'); f.read(12); clen,_=struct.unpack('<I4s',f.read(8)); j=json.loads(f.read(clen))
    blen,_=struct.unpack('<I4s',f.read(8)); bin_=f.read(blen)
    V=[];F=[];off=0
    for m in j['meshes']:
        p=m['primitives'][0]
        def acc(i,dt,n):
            a=j['accessors'][i]; bv=j['bufferViews'][a['bufferView']]
            o=bv.get('byteOffset',0)+a.get('byteOffset',0)
            assert 'byteStride' not in bv or bv['byteStride'] in (None,n*np.dtype(dt).itemsize), bv
            return np.frombuffer(bin_,dtype=dt,count=a['count']*n,offset=o).reshape(-1,n)
        v=acc(p['attributes']['POSITION'],np.float32,3); i=acc(p['indices'],np.uint32,1).reshape(-1,3)
        V.append(v);F.append(i+off);off+=len(v)
    return np.vstack(V),np.vstack(F)

V,SRC_F=load()
# source normals
def load_normals():
    f=open(SRC,'rb'); f.read(12); clen,_=struct.unpack('<I4s',f.read(8)); j=json.loads(f.read(clen))
    blen,_=struct.unpack('<I4s',f.read(8)); b=f.read(blen); out=[]
    for m in j['meshes']:
        a=j['accessors'][m['primitives'][0]['attributes']['NORMAL']]; bv=j['bufferViews'][a['bufferView']]
        out.append(np.frombuffer(b,np.float32,a['count']*3,bv.get('byteOffset',0)+a.get('byteOffset',0)).reshape(-1,3))
    return np.vstack(out)
N=load_normals()

C=np.array([5.0,-2.0]); MID=-16.1; TH0,TH1=-82.5,49.2; YCUT=6.3; CELL=0.3
dx=V[:,0]-C[0]; dz=V[:,2]-C[1]; th=np.degrees(np.arctan2(dz,dx))
rad=np.stack([dx,np.zeros_like(dx),dz],1); rad/=np.linalg.norm(rad,axis=1,keepdims=True)+1e-9
keepV=(th>TH0)&(th<TH1)&(V[:,1]>YCUT)&(((N*rad).sum(1)>-0.1)|(N[:,1]>0.55))
F=SRC_F[keepV[SRC_F].all(1)]
print('faces kept',len(F))

# align: forward = midline direction, teeth pointing down, origin = incisal edge midpoint
a=np.radians(MID); fwd=np.array([np.cos(a),0,np.sin(a)]); x0=np.array([fwd[2],0,-fwd[0]])
R=np.stack([-x0,np.array([0,-1.0,0]),fwd])          # rows: X,Y,Z axes
P=V@R.T; Nn=N@R.T
# level the occlusal plane: the cast's base is tilted, leaving the premolar cusps
# lower than the incisal edges. Pitch about X until they match.
sel=keepV
front=sel&(np.abs(P[:,0])<6); back=sel&(np.abs(P[:,0])>17)
yf,zf=np.percentile(P[front,1],1),np.percentile(P[front,2],99)
yb,zb=np.percentile(P[back,1],1),np.median(P[back,2])
ang=np.arctan2(yf-yb,zf-zb); print('pitch deg',np.degrees(ang))
def rotx(t):
    c_,s_=np.cos(t),np.sin(t); return np.array([[1,0,0],[0,c_,-s_],[0,s_,c_]])
def mismatch(t):
    Q=P[sel]@rotx(t).T; f=np.abs(Q[:,0])<6; b=np.abs(Q[:,0])>17
    return abs(np.percentile(Q[f,1],1)-np.percentile(Q[b,1],1))
best=min(np.radians(np.arange(-12,12.01,0.25)),key=mismatch); print('chosen pitch deg',np.degrees(best),'residual mm',mismatch(best))
P=P@rotx(best).T; Nn=Nn@rotx(best).T

# vertex clustering decimation (positions + source normals averaged per cell)
used=np.unique(F); key=np.floor(P[used]/CELL).astype(np.int64)
_,inv=np.unique(key,axis=0,return_inverse=True); inv=inv.ravel(); n=inv.max()+1
cnt=np.bincount(inv,minlength=n)[:,None]
NP=np.stack([np.bincount(inv,P[used][:,k],n) for k in range(3)],1)/cnt
NN=np.stack([np.bincount(inv,Nn[used][:,k],n) for k in range(3)],1); NN/=np.linalg.norm(NN,axis=1,keepdims=True)+1e-9
remap=np.full(len(V),-1,np.int64); remap[used]=inv
NF=remap[F]; NF=NF[(NF[:,0]!=NF[:,1])&(NF[:,1]!=NF[:,2])&(NF[:,0]!=NF[:,2])]
NF=np.unique(np.sort(NF,1),axis=0,return_index=True)[1]; NF=remap[F][(remap[F][:,0]!=remap[F][:,1])&(remap[F][:,1]!=remap[F][:,2])&(remap[F][:,0]!=remap[F][:,2])][NF]
# drop small disconnected islands (scan debris)
parent=np.arange(n)
def find(x):
    while parent[x]!=x: parent[x]=parent[parent[x]]; x=parent[x]
    return x
for a_,b_,c_ in NF:
    ra,rb,rc=find(a_),find(b_),find(c_); parent[rb]=ra; parent[find(c_)]=ra
root=np.array([find(i) for i in range(n)]); sizes=np.bincount(root,minlength=n)
NF=NF[sizes[root[NF[:,0]]]>200]
u=np.unique(NF); rm=np.full(n,-1); rm[u]=np.arange(len(u)); NP,NN,NF=NP[u],NN[u],rm[NF]

# Taubin smoothing: removes scan noise (which polished metal exaggerates badly)
# without shrinking the crowns, then rebuild normals from the smoothed surface.
E=np.unique(np.sort(np.vstack([NF[:,[0,1]],NF[:,[1,2]],NF[:,[0,2]]]),1),axis=0)
deg=np.bincount(E.ravel(),minlength=len(NP))[:,None].astype(np.float64)
def lap(X):
    S=np.zeros_like(X); np.add.at(S,E[:,0],X[E[:,1]]); np.add.at(S,E[:,1],X[E[:,0]]); return S/np.maximum(deg,1)-X
ITER=20
for _ in range(ITER):
    NP=NP+0.5*lap(NP); NP=NP-0.53*lap(NP)
fn=np.cross(NP[NF[:,1]]-NP[NF[:,0]],NP[NF[:,2]]-NP[NF[:,0]])
G=np.zeros_like(NP)
for k in range(3): np.add.at(G,NF[:,k],fn)
flip=np.sign((G*NN).sum(1,keepdims=True)); flip[flip==0]=1      # keep the scan's outward sense
NN=G*flip; NN/=np.linalg.norm(NN,axis=1,keepdims=True)+1e-9
for _ in range(2):
    NN=NN+0.5*lap(NN); NN/=np.linalg.norm(NN,axis=1,keepdims=True)+1e-9

# origin at incisal edge midpoint: lowest points (Y min after flip) near X=0, front surface Z max
central=np.abs(NP[:,0])<6
edgeY=np.percentile(NP[central,1],1); frontZ=np.percentile(NP[central&(NP[:,1]<edgeY+3),2],99)
NP=(NP-np.array([0,edgeY,frontZ]))*0.1      # mm -> cm
# The scanned crowns are short (~7mm). Stretch to a typical ~9.5mm so the grill
# covers the wearer's real teeth; normals get the inverse-transpose.
STRETCH=1.3
NP[:,1]*=STRETCH; NN[:,1]/=STRETCH; NN/=np.linalg.norm(NN,axis=1,keepdims=True)
print('verts',len(NP),'tris',len(NF),'bbox',NP.min(0).round(2),NP.max(0).round(2))

# ---- write GLB ----
pos=NP.astype(np.float32); nor=NN.astype(np.float32); idx=NF.astype(np.uint32).ravel()
def pad(b): return b+b'\x00'*((4-len(b)%4)%4)
chunks=[pad(idx.tobytes()),pad(pos.tobytes()),pad(nor.tobytes())]; offs=np.cumsum([0]+[len(c) for c in chunks])
gltf={"asset":{"version":"2.0","generator":"grilzelda-tryon-build","extras":{"title":"Upper crowns derived from 'Dental Cast'","author":"Nancy/Lanzi Luo (https://sketchfab.com/Thunk3D-Nancy)","license":"CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)","source":"https://sketchfab.com/3d-models/dental-cast-d2b948e3d46540ea9e70d3b2f5352e24","changes":"Cropped to the labial surface of the front eight crowns, re-oriented, decimated, scaled to centimetres."}},
 "scene":0,"scenes":[{"nodes":[0]}],"nodes":[{"mesh":0,"name":"grill_upper"}],
 "meshes":[{"primitives":[{"attributes":{"POSITION":1,"NORMAL":2},"indices":0}]}],
 "buffers":[{"byteLength":int(offs[-1])}],
 "bufferViews":[{"buffer":0,"byteOffset":int(offs[0]),"byteLength":len(idx.tobytes()),"target":34963},{"buffer":0,"byteOffset":int(offs[1]),"byteLength":len(pos.tobytes()),"target":34962},{"buffer":0,"byteOffset":int(offs[2]),"byteLength":len(nor.tobytes()),"target":34962}],
 "accessors":[{"bufferView":0,"componentType":5125,"count":int(len(idx)),"type":"SCALAR"},{"bufferView":1,"componentType":5126,"count":int(len(pos)),"type":"VEC3","min":pos.min(0).tolist(),"max":pos.max(0).tolist()},{"bufferView":2,"componentType":5126,"count":int(len(nor)),"type":"VEC3"}]}
js=json.dumps(gltf).encode(); js+=b' '*((4-len(js)%4)%4); binb=b''.join(chunks)
out=OUT
open(out,'wb').write(struct.pack('<4sII',b'glTF',2,12+8+len(js)+8+len(binb))+struct.pack('<I4s',len(js),b'JSON')+js+struct.pack('<I4s',len(binb),b'BIN\x00')+binb)
print('wrote',out,(12+16+len(js)+len(binb))//1024,'KB')
