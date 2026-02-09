import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-root">
      <header className="landing-hero">
        <div className="landing-hero-inner">
          <h1 className="landing-title">
            Every missed call is a lost customer.
            <br />
            We make sure that never happens.
          </h1>
          <p className="landing-subtitle">
            AI + human customer service for Indian clinics, salons, kirana stores
            and local businesses. Hindi, Hinglish, aur English – 24×7, without
            hiring extra staff.
          </p>
          <div className="landing-cta-row">
            <a href="/app" className="landing-cta-primary">
              Open Dashboard
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}

