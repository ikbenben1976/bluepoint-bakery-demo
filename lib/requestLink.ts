export function requestPricingHref(count: number): string {
  return count > 0 ? "/wholesale/#request-lines" : "/wholesale/#wholesale-request";
}

export function requestPricingLabel(count: number): string {
  return count > 0 ? `Request pricing (${count})` : "Request pricing";
}
