import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BadgeCheck,
  BarChart3,
  Check,
  ChevronRight,
  Factory,
  FlaskConical,
  Globe2,
  Leaf,
  Menu,
  Phone,
  Sprout,
  Truck,
  X,
} from "lucide-react";
import "../assets/app.css";
import chiliesCrate from "../assets/chilies-crate.png";
import chiliPowder from "../assets/chili-powder.png";
import farmerChilies from "../assets/farmer-chilies.png";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000`;

const navItems = [
  ["Products", "#products"],
  ["Our Farmers", "#farmers"],
  ["Why Us", "#why"],
  ["Contact", "#contact"],
];

const fallbackStats = [
  { value: "5,000+", label: "Farmers" },
  { value: "18", label: "Countries" },
  { value: "A+", label: "Grade Quality" },
];

const fallbackVarieties = [
  "Guntur Sannam",
  "Teja S17",
  "Byadgi",
  "Kashmiri",
  "Wonder Hot",
  "Endo Suryamukhi",
  "334 Variety",
];

const fallbackProducts = [
  { tag: "Best Seller", image: chiliesCrate, meta: "A Grade - Stem-cut", name: "Whole Dried Red Chili" },
  { tag: "Export Ready", image: chiliPowder, meta: "Single-origin - Stoneground", name: "Premium Chili Powder", red: true },
  { tag: "Daily Harvest", image: chiliesCrate, meta: "Hand-picked - Cold chain", name: "Fresh Green Chili" },
];

const reasons = [
  [Sprout, "Direct from Farm", "No middlemen. Farmers earn 30% more, buyers pay 20% less."],
  [FlaskConical, "Lab-Tested Quality", "Every lot screened for color, pungency, moisture and aflatoxin."],
  [Truck, "Smart Logistics", "Cold-chain handling and door-to-door global shipping."],
  [BarChart3, "Transparent Pricing", "Live mandi rates, clear margins, no surprises."],
  [Globe2, "Export to 18+ Countries", "APEDA-registered. Compliance for EU, US, GCC and SEA."],
  [Leaf, "Sustainably Grown", "Working with farms practicing low-input, climate-smart farming."],
];

const process = [
  ["01", "Sourced", "Hand-picked at peak ripeness from partner farms in Andhra and Telangana."],
  ["02", "Graded", "Sun-dried, color-sorted and quality-graded by our in-house team."],
  ["03", "Tested", "Lab-tested for ASTA color, capsaicin, moisture and pesticide residues."],
  ["04", "Shipped", "Vacuum-packed and shipped worldwide via our logistics partners."],
];

const testimonials = [
  ["R", "Ravi Naidu", "Farmer - Guntur", "Mana Mirchi paid me 35% more than my old buyer. Money in my account every Friday."],
  ["S", "Sara Lin", "Spice Importer, Singapore", "Consistent quality, clean paperwork, fast shipping. Our go-to source for Indian chili."],
  ["A", "Anjali Rao", "Chef, London", "The Byadgi powder is the real deal - vibrant color, deep aroma. Restaurant-grade."],
];

const fallbackFaqs = [
  ["What chili varieties do you supply?", "Guntur Sannam S4, Teja S17, Byadgi, Kashmiri, Wonder Hot, 334 and Endo Suryamukhi - in whole, powdered or flake form."],
  ["What are your minimum order quantities?", "Minimum order is 500 kg for domestic buyers and 1 MT for international export orders. Sample lots are available."],
  ["Do you handle international shipping?", "Yes. We manage export documentation, phytosanitary certificates, APEDA registration and freight partners."],
  ["How are farmers paid?", "Farmers receive weekly direct bank transfers at guaranteed minimum prices with fair premiums based on grade."],
  ["Is the produce certified?", "All produce is FSSAI-compliant, APEDA-registered and lot-tested for residues, aflatoxin, moisture and color."],
];

function scrollToTarget(target) {
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

function Navbar({ apiOnline }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className={`nav-inner ${open ? "open" : ""}`}>
        <a className="brand" href="#home" onClick={() => setOpen(false)}>
          <span className="brand-flame" aria-hidden="true">🌶️</span> Mana <b>Mirchi</b>
        </a>
        <div className="nav-links">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <span className={`api-dot ${apiOnline ? "online" : "offline"}`}>API {apiOnline ? "Live" : "Offline"}</span>
          <a href="#home">Sign In</a>
          <button className="btn btn-red" onClick={() => scrollToTarget("#contact")}>Request Quote</button>
        </div>
        <button className="menu-btn" type="button" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>
    </nav>
  );
}

function Hero({ stats }) {
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="pill">From the farms of Andhra Pradesh</div>
          <h1>From our <span>farms</span><br />to the world.</h1>
          <p>Mana Mirchi is the smart marketplace for premium Indian chili - direct from farmers to buyers. Better prices for growers. Better quality for the world.</p>
          <div className="hero-buttons">
            <button className="btn btn-red" onClick={() => scrollToTarget("#contact")}>Buy Premium Chili <ChevronRight size={14} /></button>
            <button className="btn btn-dark" onClick={() => scrollToTarget("#contact")}>Sell with Us</button>
          </div>
          <div className="stats">
            {stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><small>{stat.label}</small></div>)}
          </div>
        </div>
        <div className="hero-media">
          <img src={chiliesCrate} alt="Premium dried red chilies in crates" />
          <div className="cert-card"><span><BadgeCheck size={16} /></span><div><strong>Lab Certified</strong><small>FSSAI - APEDA - ISO</small></div></div>
        </div>
      </div>
    </section>
  );
}

function Ticker({ varieties }) {
  return (
    <div className="ticker">
      <div className="container ticker-inner">
        <span>Varieties We Trade</span>
        {varieties.map((variety, index) => index === 0 ? <b key={variety}>{variety}</b> : <em key={variety}>{variety}</em>)}
      </div>
    </div>
  );
}

function Products({ products }) {
  return (
    <section className="section products" id="products">
      <div className="container">
        <div className="split-head">
          <div><p className="section-kicker">Our Products</p><h2>Pure spice. <span>Honest sourcing.</span></h2></div>
          <p>Every batch is traceable to the farm. Hand-graded, lab-tested, and packed for global shipping.</p>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <article className="product-card" key={product.name}>
              <div className={`tag ${product.red ? "red" : ""}`}>{product.tag}</div>
              <img src={product.image || fallbackProducts[index]?.image || chiliesCrate} alt={product.name} />
              <div className="product-body"><small>{product.meta}</small><h3>{product.name}</h3><a href="#contact">Get pricing -&gt;</a></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="section why" id="why">
      <div className="container narrow">
        <p className="section-kicker center">Why Mana Mirchi</p>
        <h2 className="center-title">Smart farming.<br /><span>Better selling.</span></h2>
        <div className="why-grid">
          {reasons.map(([Icon, title, text]) => (
            <article key={title}><span><Icon size={14} /></span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Farmers() {
  const benefits = ["Guaranteed buy-back at fair market price", "Free soil testing and crop advisory", "Weekly payouts directly to farmer accounts", "Training on grade-A harvest practices"];
  return (
    <section className="section farmers" id="farmers">
      <div className="container farmers-grid">
        <div className="farmer-photo"><img src={farmerChilies} alt="Indian chili farmer" /></div>
        <div>
          <p className="section-kicker">Our Farmers</p>
          <h2>The hands that<br /><span>grow the heat.</span></h2>
          <p>We partner with 5,000+ smallholder farmers across Andhra Pradesh, Telangana and Karnataka. Through fair pricing, agronomy support, and direct market access, Mana Mirchi puts more value back into the village.</p>
          <ul className="check-list">{benefits.map((benefit) => <li key={benefit}><Check size={12} /> {benefit}</li>)}</ul>
          <button className="btn btn-red" onClick={() => scrollToTarget("#contact")}>Become a Partner Farmer <ChevronRight size={14} /></button>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section process">
      <div className="container">
        <p className="section-kicker center">Farm to Port</p>
        <h2 className="center-heading">From soil to shelf in 4 steps.</h2>
        <div className="process-grid">{process.map(([number, title, text]) => <article key={number}><strong>{number}</strong><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="container">
        <p className="section-kicker center">Voices from the Chain</p>
        <h2 className="center-heading">Loved by growers & buyers.</h2>
        <div className="test-grid">
          {testimonials.map(([initial, name, role, quote]) => (
            <article key={name}><div className="stars">*****</div><p>"{quote}"</p><div className="person"><span>{initial}</span><div><b>{name}</b><small>{role}</small></div></div></article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ faqs }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq">
      <div className="container">
        <p className="section-kicker center">FAQ</p>
        <h2 className="center-heading">Questions, answered.</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const question = Array.isArray(faq) ? faq[0] : faq.question;
            const answer = Array.isArray(faq) ? faq[1] : faq.answer;
            return <article className={`faq-item ${open === index ? "open" : ""}`} key={question}><button type="button" onClick={() => setOpen(open === index ? -1 : index)}>{question}<span>+</span></button><p>{answer}</p></article>;
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("loading");
    setError("");
    setEmailStatus("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.get("full_name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || "Could not submit request");
      }
      const savedQuote = await response.json();
      form.reset();
      setEmailStatus(savedQuote.email_status || "");
      setStatus("sent");
      window.setTimeout(() => setStatus("idle"), 3000);
    } catch (submitError) {
      setError(submitError.message);
      setStatus("error");
    }
  }

  return (
    <section className="contact-block" id="contact">
      <div className="container">
        <div className="contact-card">
          <div>
            <div className="drop"><Factory size={17} /></div>
            <h2>Ready to taste the<br />difference?</h2>
            <p>Whether you're sourcing a container or a kilo, our team gets back to you within 24 hours.</p>
            <ul className="contact-list"><li><Phone size={12} /> +91 98765 43210</li><li>trade@manamirchi.com</li><li>Guntur, Andhra Pradesh, India</li></ul>
          </div>
          <form onSubmit={handleSubmit}>
            <label>Full Name<input name="full_name" required minLength={2} placeholder="Your name" /></label>
            <label>Email<input name="email" required type="email" placeholder="your@email.com" /></label>
            <label>What are you looking for?<textarea name="message" required minLength={5} placeholder="Buying, selling, partnership..." /></label>
            <button className={`btn ${status === "sent" ? "btn-green" : "btn-red"}`} disabled={status === "loading"} type="submit">
              {status === "loading" ? "Sending..." : status === "sent" ? "Request Sent!" : "Request a Quote ->"}
            </button>
            {status === "sent" && emailStatus && emailStatus !== "sent" ? (
              <p className="form-note">Saved. Email status: {emailStatus}. Check /api/quotes for details.</p>
            ) : null}
            {status === "error" ? <p className="form-error">{error}</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><a className="brand" href="#home"><span className="brand-flame" aria-hidden="true">🌶️</span> Mana <b>Mirchi</b></a><p>From our farms to the world. Premium Indian chili, sourced direct, shipped global.</p><small>Empowering 5,000+ farmers across India</small></div>
        <div><h4>Trade</h4><a href="#products">Products</a><a href="#contact">Bulk Pricing</a><a href="#home">Export Compliance</a><a href="#home">Logistics</a></div>
        <div><h4>Company</h4><a href="#farmers">Our Farmers</a><a href="#home">Sustainability</a><a href="#home">About</a><a href="#contact">Contact</a></div>
      </div>
      <div className="container footer-bottom"><span>Copyright 2026 Mana Mirchi. All rights reserved.</span><span>Privacy - Terms - Compliance</span></div>
    </footer>
  );
}

function App() {
  const [siteData, setSiteData] = useState({ stats: fallbackStats, varieties: fallbackVarieties, products: fallbackProducts, faqs: fallbackFaqs });
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadSiteData() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/site`);
        if (!response.ok) throw new Error("API unavailable");
        const data = await response.json();
        if (ignore) return;
        setSiteData({
          stats: data.stats?.length ? data.stats : fallbackStats,
          varieties: data.varieties?.length ? data.varieties : fallbackVarieties,
          products: data.products?.length ? data.products.map((product, index) => ({ ...product, image: fallbackProducts[index]?.image || chiliesCrate, red: index === 1 })) : fallbackProducts,
          faqs: data.faqs?.length ? data.faqs : fallbackFaqs,
        });
        setApiOnline(true);
      } catch {
        if (!ignore) setApiOnline(false);
      }
    }
    loadSiteData();
    return () => { ignore = true; };
  }, []);

  return (
    <>
      <Navbar apiOnline={apiOnline} />
      <main>
        <Hero stats={siteData.stats} />
        <Ticker varieties={siteData.varieties} />
        <Products products={siteData.products} />
        <WhyUs />
        <Farmers />
        <Process />
        <Testimonials />
        <Faq faqs={siteData.faqs} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
