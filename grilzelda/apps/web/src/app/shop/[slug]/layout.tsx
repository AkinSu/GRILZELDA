import type { Metadata } from 'next';
import { products } from '../../../data/products';
import { STYLE_LABEL, metalLabel, toothCountLabel } from '../../../data/taxonomy';
import { priceOf } from '../../../utils/pricing';
import { formatPrice } from '../../../utils/format';

/**
 * The product page itself is a client component (it needs hover, camera and
 * WebGL state), so it can't export metadata. This server layout wraps it purely
 * to resolve the slug into a real title and description.
 */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const { config } = product;

  return {
    title: `${product.name} · ${metalLabel(config)}`,
    description:
      `${toothCountLabel(config.teeth)} ${STYLE_LABEL[config.style].toLowerCase()} ` +
      `in ${metalLabel(config)}, fitted to your teeth and made to order. ` +
      `From ${formatPrice(priceOf(config))}.`,
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
