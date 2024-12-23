import Container from "@mui/material/Container";
import { NavLink, Link } from "react-router-dom";
import { FaFacebookSquare, FaInstagram, FaTwitter } from "react-icons/fa";
import NewLogo from "D:/Development/Web-development/ReactJs/NextBoarding/client/src/assets/Logo1.png";
import { PiCopyrightLight } from "react-icons/pi";
import "../CssFolder/Footer.css";

function Footer() {
  return (
    <section className="footer">
        <Container maxWidth="lg">
        <div className="footer-content">
          <div>
              <NavLink to="/" className="Site-logo">
                <img src={NewLogo} alt="logo" className="w-32 h-auto"/>
              </NavLink>
            </div>
          <div className="quick-links">
            <h4 className="links-header">Quick Links</h4>
            <div className="Links">
              <NavLink exact to="/Home">Home</NavLink>
              <NavLink exact to="/AboutUs">About Us</NavLink>
              <NavLink exact to="/Service">Service</NavLink>
              <NavLink exact to="/SignUp">SignUp</NavLink>
            </div>
          </div>
          <div className="address">
            <h4 className="contact-header">Contact Info</h4>
            <div className="Info">
              <p>
                Address: Unit No. 6 & 7, XXXX XXX, <br />
                XXXXX XXXXX XXXXX, XXXX XXXX XXXXX, <br />
                XXXXX XXXXX XXXX.
              </p>
            </div>
          </div>
          <div className="social-media">
            <h4 className="social-media-header">Social Media</h4>
            <div className="Media">
              <FaFacebookSquare className="Media-Icon" />
              <FaInstagram className="Media-Icon" />
              <FaTwitter className="Media-Icon" />
            </div>
            <div className="Links">
                <Link exact to="tel:(212) 658-3916">Telephone No: (212) 658-3916</Link>
                <Link exact to="mailto:info@flyEase.in">Email: info@NextBoarding.in</Link>
            </div>
          </div>
        </div>
        <div className="Copyright">
            <span>Copyright <PiCopyrightLight className="inline"/> 2024 All rights reserved </span>
        </div>
    </Container>
      </section>
  );
}

export default Footer;
