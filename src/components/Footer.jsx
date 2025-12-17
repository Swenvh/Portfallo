import React from "react";

export default function Footer() {
  return (
    <footer className="p-5 text-center text-gray-400 bg-gray-800 mt-10">
      © {new Date().getFullYear()} Portfallo — Alle rechten voorbehouden.
    </footer>
  );
}
