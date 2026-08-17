import React from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  color = "#63493f",
}) => {
  const sizeMap = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center relative h-dvh">
      <div
        className={`${sizeMap[size]} rounded-full absolute animate-ping opacity-75`}
        style={{ backgroundColor: color }}
      />

      <div
        className={`${sizeMap[size]} rounded-full border-4 border-t-transparent animate-spin`}
        style={{ borderColor: `${color} transparent ${color} ${color}` }}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>

      <div
        className={`${sizeMap[size]} rounded-full absolute flex items-center justify-center`}
      >
        <div
          className="w-1/4 h-1/4 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default Loader;
