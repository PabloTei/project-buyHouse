import React from "react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12">
      <div className="border-t border-gray-200 mt-4">
        <p className="text-center text-md py-3 text-gray-500">
          Diseñado por Pablo Teijeiro
        </p>
      </div>
    </footer>
  );
};

export default Footer;
