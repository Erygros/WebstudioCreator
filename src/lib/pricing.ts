import { z } from 'zod';
import { getProduct, PRICE_VERSION } from './catalog';
export const configurationSchema = z
  .object({
    productId: z.string().max(80),
    quantities: z.record(z.string().max(40), z.number().int().min(0).max(20)),
    priceVersion: z.literal(PRICE_VERSION),
  })
  .strict();
export type Configuration = z.infer<typeof configurationSchema>;
export function calculate(input: Configuration) {
  const config = configurationSchema.parse(input);
  const product = getProduct(config.productId);
  if (!product) throw new Error('Unknown product');
  for (const [id, qty] of Object.entries(config.quantities)) {
    const option = product.options.find((o) => o.id === id);
    if (!option || qty > option.max) throw new Error('Invalid option');
  }
  const lines = [
    {
      id: product.id,
      name: product.name,
      quantity: 1,
      amount: product.price,
      period: product.period,
    },
    ...product.options
      .filter((o) => (config.quantities[o.id] || 0) > 0)
      .map((o) => ({
        id: o.id,
        name: o.name,
        quantity: config.quantities[o.id],
        amount: o.price * config.quantities[o.id],
        period: o.period,
      })),
  ];
  const once = lines.filter((l) => l.period === 'once').reduce((s, l) => s + l.amount, 0);
  const monthly = lines.filter((l) => l.period === 'monthly').reduce((s, l) => s + l.amount, 0);
  const deposit = Math.round(once * 0.5);
  return {
    version: PRICE_VERSION,
    lines,
    once,
    monthly,
    deposit,
    remainder: once - deposit,
    firstPeriod: once + monthly,
    comingSoon: !!product.comingSoon,
  };
}
