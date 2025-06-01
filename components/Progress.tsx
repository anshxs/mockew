import React from "react";

interface ProgressProps {
  progress: number; // Progress value between 0 and 1
  color?: string; // Color for the progress bar
  bgColor?: string; // Background color for the progress bar
  total?: number; // Total value for the progress bar, default is 5
}
const Progress: React.FC<ProgressProps> = ({
  progress = 0,
  total = 5,
  color,
  bgColor
}) => {
  const percentage = (progress / total) * 100;

  return (
    <div className="flex gap-1.5">
        {[...Array(total)].map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded transition-all ${index < progress ? "bg-cyan-500" : "bg-cyan-100"}`}
            style={{
              backgroundColor: index < progress ? color || "rgba(1,1,1,1)" : bgColor || "rgba(1,1,1,0.1)",
            }}
          ></div>
        ))}
    </div>
  );
}
export default Progress;