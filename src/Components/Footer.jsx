import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Logo from "../assets/Logo";
import "../i18n";
import { Phone, Email } from "../assets/FooterSVGs";

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
        gridTemplateColumns: "1fr 1fr 1fr",
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
};

function Footer() {
    const { t } = useTranslation();
    const [hoveredItem, setHoveredItem] = useState(null);

    const handleHover = (key) => setHoveredItem(key);
    const handleLeave = () => setHoveredItem(null);

    const renderLink = (key) => (
        <p
            style={hoveredItem === key ? { ...styles.tncText, ...styles.tncTextHover } : styles.tncText}
            onMouseEnter={() => handleHover(key)}
            onMouseLeave={handleLeave}
        >
            {t(key)}
        </p>
    );

    return (
        <footer style={styles.footer}>
            <div style={styles.footerContainer}>
                <Logo style={styles.logo} />
                <div style={styles.footerContainer2}>
                    <div style={styles.usefulBlock}>
                        <p style={styles.title}>{t("footer.information.title")}</p>
                        <div style={styles.content}>
                            {renderLink("footer.information.redirects.one")}
                            {renderLink("footer.information.redirects.two")}
                            {renderLink("footer.information.redirects.three")}
                        </div>
                    </div>
                    <div style={styles.usefulBlock}>
                        <p style={styles.title}>{t("footer.links.title")}</p>
                        <div style={styles.content}>
                            {renderLink("footer.links.redirects.one")}
                            {renderLink("footer.links.redirects.two")}
                            {renderLink("footer.links.redirects.three")}
                        </div>
                    </div>
                    <div style={styles.usefulBlock}>
                        <p style={styles.title}>{t("footer.contact.title")}</p>
                        <div style={styles.content}>
                            <div style={styles.contactSvg}>
                                <Phone />
                                {renderLink("footer.contact.redirects.one")}
                            </div>
                            <div style={styles.contactSvg}>
                                <Email />
                                {renderLink("footer.contact.redirects.two")}
                            </div>
                            <div style={styles.socialSvgContainer}>
                                <div className="insta" style={styles.socialSvg}></div>
                                <div className="twitter" style={styles.socialSvg}></div>
                                <div className="facebook" style={styles.socialSvg}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={styles.copyright}>
                <span></span>
                <p>{t("footer.copyright")}</p>
                <div style={styles.tnc}>
                    {renderLink("footer.tnc.privacy")}
                    {renderLink("footer.tnc.refund")}
                    {renderLink("footer.tnc.terms")}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
