import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-24">
      <p className="kicker">Demo</p>
      <h1 className="section-title">That page is not on this demo.</h1>
      <Link href="/" className="btn btn-primary mt-8">
        Back to Bluepoint Bakery
      </Link>
    </div>
  );
}
