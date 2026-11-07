import { whyBluepoint } from "@/data/whyBluepoint";

export function WhyBluepoint() {
  return (
    <section className="shell why-bluepoint" aria-labelledby="why-bluepoint-heading">
      <div className="section-intro">
        <div>
          <p className="eyebrow">Wholesale buyers</p>
          <h2 id="why-bluepoint-heading">Why Bluepoint</h2>
        </div>
      </div>
      <ul className="why-grid">
        {whyBluepoint.map((pillar) => (
          <li key={pillar.title} className="why-card">
            <h3>{pillar.title}</h3>
            <p>{pillar.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
