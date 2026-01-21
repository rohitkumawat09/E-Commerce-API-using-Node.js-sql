import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-section">
          <h1 className="footer-logo">MyCompany</h1>
          <p className="footer-text">हमारा उद्देश्य आपको बेहतरीन सेवा देना है।</p>
        </div>

        <div className="footer-section">
          <h2 className="footer-title">Quick Links</h2>
          <ul className="footer-links">
            <li><Link to="/">Ecommerce</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2 className="footer-title">Support</h2>
          <ul className="footer-links">
            <li><Link to="/faqs">FAQs</Link></li>
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2 className="footer-title">Follow Us</h2>
          <div className="social-icons">
            <Link to="/facebook">FB</Link>
            <Link to="/twitter">TW</Link>
            <Link to="/instagram">IG</Link>
            <Link to="/linkedin">LI</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} MyCompany. All rights reserved.
      </div>
    </footer>
  );
}


