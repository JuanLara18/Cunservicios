import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ title, description, linkTo, icon }) => {
  return (
    <div className="card">
      <div className="flex items-center mb-3">
        {icon && <div className="mr-3 text-blue-600">{icon}</div>}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="mb-4">{description}</p>
      <Link to={linkTo} className="text-blue-600 hover:underline">
        Conocer más
      </Link>
    </div>
  );
};

export default ServiceCard;
