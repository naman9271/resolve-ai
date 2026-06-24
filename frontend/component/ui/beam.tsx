import React from "react";

type BlockBeamsProps = {
  className?: string;
};

export function BlockBeams({ className }: BlockBeamsProps) {
  return (
    <div
      aria-hidden
      className={
        className ??
        "absolute inset-0 pointer-events-none overflow-hidden"
      }
    >
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-[10%] w-px bg-white/10" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
        <div className="absolute inset-y-0 right-[10%] w-px bg-white/10" />
        <div className="absolute inset-x-0 top-[20%] h-px bg-white/10" />
        <div className="absolute inset-x-0 bottom-[20%] h-px bg-white/10" />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-white/5 via-transparent to-white/5" />
    </div>
  );
}
