/**
 * Wholesale “Why Bluepoint” lines, rewritten in sentence case from the
 * bakery’s values sheets (product, company, selection, value, service,
 * integrity). The sheet photographs are not shown.
 */

export type WhyPillar = {
  title: string;
  body: string;
};

export const whyBluepoint: readonly WhyPillar[] = [
  {
    title: "Product",
    body: "Our products are handmade, baked fresh, and delivered in our own trucks, six days a week.",
  },
  {
    title: "Company",
    body: "Bluepoint is Colorado’s oldest and largest locally owned wholesale bakery.",
  },
  {
    title: "Selection",
    body: "With 600 items and sizes available, and new products every month, we have Colorado’s largest selection.",
  },
  {
    title: "Value",
    body: "MVPR: maximum value to price ratio. You always get the most for your money.",
  },
  {
    title: "Service",
    body: "With over 40 years of combined experience, our sales and customer service staff always take the time to listen and work with you.",
  },
  {
    title: "Integrity",
    body: "The entire Bluepoint team is committed to treating you, our customer, with the honesty, integrity, and respect you deserve.",
  },
];
