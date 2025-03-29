import React from "react";
import { SlCalender } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";

const style = {
  card: {
    position: "absolute",
    width: "22.97rem",
    height: "29.26rem",
    boxShadow: "0px -0.28rem 2.05rem 0.14rem rgba(0, 0, 0, 0.25)",
    background: "rgb(255, 255, 255)",
  },
  cardImage: {
    width: "100%",
    height: "75.2%",
    backgroundColor: "rgb(0, 0, 0)",
    backgroundSize: "cover",
  },
  cardTitle: {
    color: "rgb(0, 0, 0)",
    fontFamily: "Poppins",
    fontSize: "23.78px",
    fontWeight: 600,
    lineHeight: "20.26px",
    letterSpacing: "10%",
    textAlign: "left",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    padding: "1rem",
  },
  detailStrip: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "left",
    gap: "0.5rem",
  },
  cardDetails: {
    color: "rgb(0, 0, 0)",
    fontFamily: "Poppins",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "20px",
    letterSpacing: "10%",
    textAlign: "left",
    width: "70%",
    display: "flex",
    gap: "0.5rem",
    flexwrap: "wrap",
  },
};

function Cards({
  eventName,
  eventPoster,
  eventAddress,
  eventDate,
  eventPrice,
  eventRank,
}) {
  return (
    <div className="card" style={style.card}>
      <div className="cardImage" style={style.cardImage}></div>
      <div className="cardTitle" style={style.cardTitle}>
        {eventName}
      </div>
      <div className="details" style={style.details}>
        <div className="eventDate" style={style.detailStrip}>
          <SlCalender />
          <p style={style.cardDetails}>{eventDate}</p>
        </div>
        <div className="eventAddress" style={style.detailStrip}>
          <IoLocationOutline scale={1.5} />
          <p style={style.cardDetails}>{eventAddress}</p>
        </div>
      </div>
    </div>
  );
}

export default Cards;
