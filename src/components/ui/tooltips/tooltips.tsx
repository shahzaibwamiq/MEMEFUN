import React, { ReactNode } from "react";

type TooltipProps = {
  children: ReactNode;
  text: string;
  position?: "top" | "bottom" | "left" | "right";
};

const Tooltip = ({ children, text, position = "top" }: TooltipProps) => {
  return (
    <div className={`tooltip-container ${position}`}>
      {children}
      <span className="tooltip-text">{text}</span>
    </div>
  );
};

export default Tooltip;
