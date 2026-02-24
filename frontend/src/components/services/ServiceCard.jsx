import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ title, description, linkTo, icon }) => {
  return (
    <div className="card card-hover">
      <div className="mb-3 flex items-center">
        {icon && <div className="mr-3 text-blue-600">{icon}</div>}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="mb-4 text-slate-600">{description}</p>
      <Link to={linkTo} className="inline-flex items-center font-medium text-blue-600 hover:underline">
        Conocer más
        <span className="ml-1">&rarr;</span>
      </Link>
    </div>
  );
};

export default ServiceCard;
