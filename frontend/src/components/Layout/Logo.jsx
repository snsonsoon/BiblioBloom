import React from "react";
import "./Logo.css";
import logoLarge from "../../assets/logo-large.png";
import logoSmall from "../../assets/logo-small.png";

const Logo = ({ size = "large" }) => {
  return (
    <div className={`logo ${size}`}>
      <img
        src={size === "large" ? logoLarge : logoSmall}
        alt="BiblioBloom 로고"
      />
    </div>
  );
};

export default Logo;
