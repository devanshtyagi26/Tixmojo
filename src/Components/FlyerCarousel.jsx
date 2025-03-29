import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import FlyerShape from "../assets/FlyerShape";

// Import slick styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FlyerCarousel = ({ flyers, containerId }) => {
  const { t } = useTranslation();
  const sliderRef = useRef(null);

  // Custom navigation buttons
  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        className="custom-arrow prev-arrow"
        onClick={onClick}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          left: "15px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          color: "#000",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
          fontSize: "24px",
        }}
      >
        <MdNavigateBefore style={{ fontSize: "26px" }} />
      </button>
    );
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        className="custom-arrow next-arrow"
        onClick={onClick}
        aria-label="Next slide"
        style={{
          position: "absolute",
          right: "15px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          color: "#000",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
          fontSize: "24px",
        }}
      >
        <MdNavigateNext style={{ fontSize: "26px" }} />
      </button>
    );
  };

  // Settings for the carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "5%", // Adjust padding for better alignment
    focusOnSelect: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          centerPadding: "4%",
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          centerPadding: "3%",
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          centerPadding: "2%",
        },
      },
    ],
  };

  useEffect(() => {
    // Apply custom styling to slides after component mounts
    const applyStyling = () => {
      if (sliderRef.current) {
        const slides = document.querySelectorAll(
          `#${containerId} .slick-slide`
        );
        const centerSlide = document.querySelector(
          `#${containerId} .slick-current`
        );

        // Apply styling to all slides
        slides.forEach((slide) => {
          slide.style.transition = "all 0.5s ease";
          slide.style.position = "relative";

          // Side slides (not active)
          if (!slide.classList.contains("slick-current")) {
            slide.style.opacity = "0.7"; // Slightly more visible
            slide.style.transform = "scale(0.85) translateX(0)"; // Bring side slides closer in size
            slide.style.filter = "brightness(0.9)";
            slide.style.zIndex = "1";
            slide.style.margin = "0 auto";

            // Ensure clipping works on side slides too
            const flyerCard = slide.querySelector(".flyer-card");
            if (flyerCard) {
              flyerCard.style.display = "block";
              flyerCard.style.width = "90%";
            }
          }
        });

        // Active (center) slide
        if (centerSlide) {
          centerSlide.style.opacity = "1";
          centerSlide.style.transform = "scale(1.15) translateX(0)"; // Increase size of the center flyer
          centerSlide.style.filter = "brightness(1)";
          centerSlide.style.zIndex = "10";
          centerSlide.style.margin = "0 auto";

          // Ensure active slide shows properly
          const flyerCard = centerSlide.querySelector(".flyer-card");
          if (flyerCard) {
            flyerCard.style.display = "block";
            flyerCard.style.width = "100%";
            flyerCard.style.margin = "0 auto"; // Center card
          }
        }
      }
    };

    // Apply initial styling
    applyStyling();

    // Apply styling when slides change
    const handleAfterChange = () => {
      applyStyling();
    };

    // Set up event listener for slide changes
    if (sliderRef.current) {
      const slickList = sliderRef.current.innerSlider.list;
      slickList.addEventListener("transitionend", handleAfterChange);

      return () => {
        if (slickList) {
          slickList.removeEventListener("transitionend", handleAfterChange);
        }
      };
    }
  }, [containerId]);

  return (
    <div
      id={containerId}
      style={{
        margin: "60px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Include the SVG shape with clip path */}
      <FlyerShape
        className="flyer-shape"
        uniqueId={containerId}
        width="1200"
        height="400"
      />
      <div
        style={{
          padding: "0 60px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginRight: "20px",
            whiteSpace: "nowrap",
          }}
        >
          {t("eventsSection.sectionTitles.featuredEvents")}
        </h2>
      </div>

      <div
        className="carousel-container"
        style={{ position: "relative", maxWidth: "100%" }}
      >
        <Slider ref={sliderRef} {...settings}>
          {flyers.map((flyer, index) => (
            <div key={index} className="flyer-slide">
              <div
                onClick={() => window.open(flyer.ticketLink, "_blank")}
                className="flyer-card"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  height: "400px", // Increased height for larger flyer
                  margin: "0 auto", // Center the flyer
                  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                  clipPath: `url(#${containerId}ClipPath)`, // Use the SVG clip path with container-specific ID
                  width: "95%", // Increased width for larger flyer
                  aspectRatio: "1000 / 400", // Match the SVG viewBox aspect ratio
                }}
              >
                {/* Main image */}
                <img
                  src={flyer.image}
                  alt={flyer.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "relative", // Ensure proper stacking
                    zIndex: "0", // Keep image below text overlay
                  }}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Custom styles for the carousel */}
      <style jsx="true">{`
        /* Make center slide larger and overlap side slides */
        .slick-track {
          display: flex;
          align-items: center;
        }
        .slick-slide {
          transition: all 0.5s ease;
        }
        /* Hide scrollbar */
        .slick-list {
          overflow: visible !important;
        }
        .carousel-container {
          position: relative;
          max-width: 95%;
          margin: 0 auto;
        }
        /* Ensure center slide is on top */
        .slick-current {
          z-index: 10;
        }
        /* Adjust container padding to account for visible overflow */
        #${containerId} {
          padding: 0 15px;
          overflow: hidden;
        }

        /* Custom flyer styles */
        .flyer-slide > div {
          position: relative;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .slick-current .flyer-slide > div:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }

        /* Apply consistent clip path for all slides */
        .flyer-card {
          clip-path: url(#${containerId}ClipPath);
          transform-origin: center center;
          max-width: 100%;
        }

        /* Add a subtle border effect */
        .flyer-slide > div::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.1);
          clip-path: url(#${containerId}ClipPath);
        }

        /* Add a subtle reflection effect */
        .flyer-slide > div::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 30%;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          pointer-events: none;
          z-index: 1;
          clip-path: url(#${containerId}ClipPath);
        }

        /* Add a subtle edge effect */
        .flyer-card {
          position: relative;
        }

        .flyer-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
          pointer-events: none;
          z-index: 3;
        }
      `}</style>
    </div>
  );
};

FlyerCarousel.propTypes = {
  flyers: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      ticketLink: PropTypes.string.isRequired,
      ticketSite: PropTypes.string.isRequired,
    })
  ).isRequired,
  containerId: PropTypes.string.isRequired,
};

export default FlyerCarousel;
