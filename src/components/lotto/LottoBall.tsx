"use client";

import { getBallColor, getBallBorderColor } from "@/lib/lotto";
import { cn } from "@/lib/utils";

interface LottoBallProps {
  number: number;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs font-bold",
  md: "w-10 h-10 text-sm font-bold",
  lg: "w-12 h-12 text-base font-bold",
};

export function LottoBall({ number, size = "md", animate = false }: LottoBallProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center border-2 shadow-md select-none",
        getBallColor(number),
        getBallBorderColor(number),
        sizeClasses[size],
        animate && "transition-all duration-300 hover:scale-110"
      )}
    >
      {number}
    </div>
  );
}
