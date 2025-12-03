import React from "react";

export const ThemeCard = ({
  theme,
  handleThemeChange,
  value,
  title,
  description,
  style,
}: {
  theme: string;
  handleThemeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  title: string;
  description: string;
  style: React.CSSProperties;
}) => (
  <div className="col-md-4">
    <div
      className={`card theme-card ${theme === value ? "border-primary" : ""}`}
      onClick={() =>
        handleThemeChange({
          target: { value },
        } as React.ChangeEvent<HTMLInputElement>)
      }
      style={style}
    >
      <div className="card-body text-center p-3">
        <h5 className="card-title mb-1">{title}</h5>
        <p className="small text-muted mb-0">{description}</p>
      </div>
    </div>
  </div>
);
