import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isDark?: boolean;
}

export default function Input({ isDark, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full p-4 rounded-xl outline-none border-2 font-medium focus:border-purple-500 transition-all",
        isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent",
        className
      )}
      {...props}
    />
  );
}
