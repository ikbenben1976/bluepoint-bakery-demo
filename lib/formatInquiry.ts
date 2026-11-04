const CUSTOMER_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  cafe: "Café",
  hotel: "Hotel",
  "grocery/retail": "Grocery / retail",
  institution: "Institution",
  other: "Other",
};

export function formatCustomerType(value: string): string {
  return CUSTOMER_LABELS[value] ?? value;
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (local.length === 10) {
    return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
  }
  return value.trim();
}

export function formatStartDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
