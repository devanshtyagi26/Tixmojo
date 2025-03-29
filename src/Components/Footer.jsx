import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Logo from "../assets/Logo";
import "../i18n";
import { Phone, Email } from "../assets/FooterSVGs";
import { Link } from "react-router-dom";
const styles = {
  footer: {
    boxShadow: "0px 1px 45px 5px rgba(0, 0, 0, 0.11)",
    background: "rgb(255, 255, 255)",
    width: "100vw",
    height: "140px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "column",
    position: "fixed",
    bottom: "0",
    padding: "2rem 0 0 0",
  },
  footerContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "80%",
    alignItems: "center",
    gap: "1rem",
  },
  logo: {
    color: "rgb(0, 0, 0)",
    fontFamily: "Cabin",
    fontSize: "53.11px",
    fontWeight: "700",
    textAlign: "left",
    marginLeft: "5rem",
  },
  copyright: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    padding: "0 1rem",
    color: "rgb(0, 0, 0)",
    fontFamily: "Poppins",
    fontSize: "12px",
    fontWeight: "300",
    textAlign: "left",
    borderTop: "1px solid rgba(0, 0, 0, 0.17)",
  },
  tnc: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    gap: "1rem",
    alignSelf: "flex-end",
  },
  tncText: {
    fontFamily: "Poppins",
    fontSize: "12px",
    fontWeight: "300",
    cursor: "pointer",
    color: "rgb(0, 0, 0)",
    textDecoration: "none",
    transition: "text-decoration 0.2s ease-in-out",
  },
  tncTextHover: {
    textDecoration: "underline",
  },
  footerContainer2: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "10rem",
  },
  usefulBlock: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  title: {
    color: "rgb(0, 0, 0)",
    fontFamily: "Poppins",
    fontSize: "19px",
    fontWeight: "700",
    textAlign: "left",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    textDecoration: "none",
  },
  contactSvg: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
  },
  socialSvgContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "0.5rem",
  },
  socialSvg: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "rgb(255, 255, 255)",
    border: "1px solid rgb(0, 0, 0)",
  },

  // Mobile
  footerContainer2Mobile: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "10rem",
  },
  copyrightMobile: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    padding: "0 1rem",
    color: "rgb(0, 0, 0)",
    fontFamily: "Poppins",
    fontSize: "12px",
    fontWeight: "300",
    textAlign: "left",
    borderTop: "1px solid rgba(0, 0, 0, 0.17)",
  },
  // Mobile
  footerMobile: {
    boxShadow: "0px 1px 45px 5px rgba(0, 0, 0, 0.11)",
    background: "rgb(255, 255, 255)",
    width: "100vw",
    height: "220px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    position: "fixed",
    bottom: "0",
    padding: "2rem 0 0 0",
  },
  footerContainerMobile: {
    display: "flex",
    justifyContent: "space-between",
    width: "85%",
    alignItems: "center",
    gap: "1rem",
  },
};

function Footer() {
  const { t } = useTranslation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleHover = (key) => setHoveredItem(key);
  const handleLeave = () => setHoveredItem(null);

  const renderLink = (key) => (
    <p
      style={
        hoveredItem === key
          ? { ...styles.tncText, ...styles.tncTextHover }
          : styles.tncText
      }
      onMouseEnter={() => handleHover(key)}
      onMouseLeave={handleLeave}
    >
      {t(key)}
    </p>
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile ? (
        // Mobile
        <footer style={styles.footerMobile}>
          <div style={styles.footerContainerMobile}>
            <div style={styles.usefulBlock}>
              <p style={styles.title}>{t("footer.information.title")}</p>
              <div style={styles.content}>
                <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                  {renderLink("footer.information.redirects.one")}
                </Link>
                <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                  {renderLink("footer.information.redirects.two")}
                </Link>
                <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                  {renderLink("footer.information.redirects.three")}
                </Link>
              </div>
            </div>
            <div style={styles.usefulBlock}>
              <p style={styles.title}>{t("footer.links.title")}</p>
              <div style={styles.content}>
                <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                  {renderLink("footer.links.redirects.one")}
                </Link>
                <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                  {renderLink("footer.links.redirects.two")}
                </Link>
                <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                  {renderLink("footer.links.redirects.three")}
                </Link>
              </div>
            </div>
          </div>
          <div style={styles.footerContainerMobile}>
            <Logo style={styles.logo} isMobile={isMobile} />
            <div style={styles.usefulBlock}>
              <p style={styles.title}>{t("footer.contact.title")}</p>
              <div style={styles.content}>
                <div style={styles.contactSvg}>
                  <Phone />
                  <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                    {renderLink("footer.contact.redirects.one")}
                  </Link>
                </div>
                <div style={styles.contactSvg}>
                  <Email />
                  <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                    {renderLink("footer.contact.redirects.two")}
                  </Link>
                </div>
                <div style={styles.socialSvgContainer}>
                  <div className="insta" style={styles.socialSvg}></div>
                  <div className="twitter" style={styles.socialSvg}></div>
                  <div className="facebook" style={styles.socialSvg}></div>
                </div>
              </div>
            </div>
          </div>
          <div style={styles.copyrightMobile}>
            <span></span>
            <p>{t("footer.copyright")}</p>
          </div>
        </footer>
      ) : (
        // Desktop
        <footer style={styles.footer}>
          <div style={styles.footerContainer}>
            <Logo style={styles.logo} />
            <div style={styles.footerContainer2}>
              <div style={styles.usefulBlock}>
                <p style={styles.title}>{t("footer.information.title")}</p>
                <div style={styles.content}>
                  <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                    {renderLink("footer.information.redirects.one")}
                  </Link>
                  <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                    {renderLink("footer.information.redirects.two")}
                  </Link>
                  <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                    {renderLink("footer.information.redirects.three")}
                  </Link>
                </div>
              </div>
              <div style={styles.usefulBlock}>
                <p style={styles.title}>{t("footer.links.title")}</p>
                <div style={styles.content}>
                  <Link to="./page-not-found" style={{ textDecoration: "none" }}>
                    {renderLink("footer.links.redirects.one")}
                  </Link>
                  <Link to="./page-not-found" style={{ textDecoration: "none" }}>
                    {renderLink("footer.links.redirects.two")}
                  </Link>
                  <Link to="./page-not-found" style={{ textDecoration: "none" }}>
                    {renderLink("footer.links.redirects.three")}
                  </Link>
                </div>
              </div>
              <div style={styles.usefulBlock}>
                <p style={styles.title}>{t("footer.contact.title")}</p>
                <div style={styles.content}>
                  <Link to="./page-not-found" style={{ textDecoration: "none" }}>
                    <div style={styles.contactSvg}>
                      <Phone />
                      {renderLink("footer.contact.redirects.one")}
                    </div>
                  </Link>
                  <Link to="./page-not-found" style={{ textDecoration: "none" }}> 
                    <div style={styles.contactSvg}>
                      <Email />
                      {renderLink("footer.contact.redirects.two")}
                    </div>
                  </Link>
                  <div style={styles.socialSvgContainer}>
                    <Link to="./page-not-found" style={{ textDecoration: "none" }}>
                      <div className="insta" style={styles.socialSvg}></div>
                    </Link>
                    <Link to="./page-not-found" style={{ textDecoration: "none" }}>
                      <div className="twitter" style={styles.socialSvg}></div>
                    </Link>
                    <Link to="./page-not-found" style={{ textDecoration: "none" }}>
                      <div className="facebook" style={styles.socialSvg}></div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={styles.copyright}>
            <span></span>
            <p>{t("footer.copyright")}</p>
            <div style={styles.tnc}>
              <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                {renderLink("footer.tnc.privacy")}
              </Link>
              <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                {renderLink("footer.tnc.refund")}
              </Link>
              <Link to="/page-not-found" style={{textDecoration: "none"}}>{renderLink("footer.tnc.terms")}</Link>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

export default Footer;
