// Tooltip.js
import React, { useState, useEffect } from "react";

const Tooltip = ({ text, onClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    visible && (
      <div
        className="fixed bottom-10 right-10 bg-blue-500 text-white text-xs px-4 py-2  cursor-pointer"
        onClick={onClick}
      >
        {text}
      </div>
    )
  );
};

export default Tooltip;