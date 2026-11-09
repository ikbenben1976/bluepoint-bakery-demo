export function requestPricingHref(count: number): string {
  return count > 0 ? "/wholesale/#request-lines" : "/wholesale/#wholesale-request";
}

export function requestBarLabel(count: number): string {
  const noun = count === 1 ? "item" : "items";
  return `${count} ${noun} in your request · Review`;
}
