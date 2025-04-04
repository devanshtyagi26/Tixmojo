import React from 'react';
import { IoMdClose } from "react-icons/io";

const ContactPopup = ({ event, setShowContactPopup }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
        backdropFilter: "blur(5px)",
      }}
      onClick={() => setShowContactPopup(false)}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "30px",
          width: "100%",
          maxWidth: "500px",
          position: "relative",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--neutral-500)",
            transition: "color 0.2s ease",
          }}
          onClick={() => setShowContactPopup(false)}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--neutral-800)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--neutral-500)";
          }}
        >
          <IoMdClose />
        </button>

        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "20px",
            color: "var(--dark)",
          }}
        >
          Contact Organizer
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              backgroundColor: "var(--primary)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: "700",
            }}
          >
            {event.organizer.name.charAt(0)}
          </div>
          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "var(--dark)",
              }}
            >
              {event.organizer.name}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "var(--neutral-600)",
              }}
            >
              Event Organizer
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--purple-50)",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <h4
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginTop: 0,
              marginBottom: "10px",
              color: "var(--primary)",
            }}
          >
            Contact Information
          </h4>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {event.organizer.contactEmail && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    color: "var(--primary)",
                    fontWeight: "600",
                    width: "80px",
                  }}
                >
                  Email:
                </div>
                <a
                  href={`mailto:${event.organizer.contactEmail}`}
                  style={{
                    color: "var(--neutral-800)",
                    textDecoration: "none",
                    borderBottom: "1px dashed var(--purple-200)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--primary)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--neutral-800)";
                    e.currentTarget.style.borderColor = "var(--purple-200)";
                  }}
                >
                  {event.organizer.contactEmail}
                </a>
              </div>
            )}

            {event.organizer.phone && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    color: "var(--primary)",
                    fontWeight: "600",
                    width: "80px",
                  }}
                >
                  Phone:
                </div>
                <a
                  href={`tel:${event.organizer.phone}`}
                  style={{
                    color: "var(--neutral-800)",
                    textDecoration: "none",
                    borderBottom: "1px dashed var(--purple-200)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--primary)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--neutral-800)";
                    e.currentTarget.style.borderColor = "var(--purple-200)";
                  }}
                >
                  {event.organizer.phone}
                </a>
              </div>
            )}

            {event.organizer.website && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    color: "var(--primary)",
                    fontWeight: "600",
                    width: "80px",
                  }}
                >
                  Website:
                </div>
                <a
                  href={event.organizer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--neutral-800)",
                    textDecoration: "none",
                    borderBottom: "1px dashed var(--purple-200)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--primary)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--neutral-800)";
                    e.currentTarget.style.borderColor = "var(--purple-200)";
                  }}
                >
                  {event.organizer.website}
                </a>
              </div>
            )}

            {event.organizer.location && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    color: "var(--primary)",
                    fontWeight: "600",
                    width: "80px",
                  }}
                >
                  Location:
                </div>
                <div style={{ color: "var(--neutral-800)" }}>
                  {event.organizer.location}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
          }}
        >
          <button
            onClick={() => setShowContactPopup(false)}
            style={{
              backgroundColor: "white",
              color: "var(--neutral-800)",
              border: "1px solid var(--neutral-200)",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--neutral-100)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
            }}
          >
            Close
          </button>
          <button
            onClick={() => {
              window.location.href = `mailto:${event.organizer.contactEmail}?subject=Regarding: ${event.title}`;
            }}
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--purple-700)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
            }}
          >
            Email Organizer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactPopup;