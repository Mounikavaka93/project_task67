export function formatPrice(value) {
  const number = Number(value) || 0;
  const hasCents = Math.round(number * 100) % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(number);
}
