export const FREE_SHIPPING_AT = 150;
export const SHIPPING_FEE = 12;
export const TAX_RATE = 0.08;

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function summarize(lines) {
  const subtotal = roundMoney(lines.reduce((sum, line) => sum + line.price * line.qty, 0));
  const savings = roundMoney(
    lines.reduce((sum, line) => sum + Math.max(0, line.originalPrice - line.price) * line.qty, 0),
  );
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
  const tax = roundMoney(subtotal * TAX_RATE);
  const total = roundMoney(subtotal + shipping + tax);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  return { subtotal, savings, shipping, tax, total, count };
}
