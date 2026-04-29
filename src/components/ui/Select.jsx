import React from "react";
import { cn } from "../../lib/utils";

export default function Select({ children, isDark, className, ...props }) {
  return (
    <select
      className={cn(
        "w-full p-4 rounded-xl outline-none border-2 font-medium focus:border-purple-500 transition-all",
        isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-black text-black",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
