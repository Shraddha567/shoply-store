import React from "react";

export default function Loader({ label = "Loading..." }) {
  return <div className="loader">{label}</div>;
}
