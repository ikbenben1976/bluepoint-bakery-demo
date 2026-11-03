import { SERVICE_AREAS } from "@/lib/deliveryArea";
import { EMAIL, INSTAGRAM } from "@/data/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Bakery", "LocalBusiness"],
    name: "Bluepoint Bakery",
    telephone: "+1-303-298-1100",
    email: EMAIL,
    foundingDate: "1987",
    url: "https://www.bluepointbakery.com/",
    image:
      "https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/BPLogo_-718w.jpg",
    sameAs: [INSTAGRAM],
    address: {
      "@type": "PostalAddress",
      streetAddress: "5105 Cook St.",
      addressLocality: "Denver",
      addressRegion: "CO",
      postalCode: "80216",
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "15:00",
      },
    ],
    areaServed: SERVICE_AREAS.map((area) => area.label),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
