'use client';

import { ReactNode } from "react";
import { helix } from "ldrs";

helix.register();

export default function FullPageLoader({
  show,
  text = "Creating alert...",
  children,
}: {
  show: boolean;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <>
      {children}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-neutral-900/80 px-8 py-6 shadow-2xl">
            <l-helix size="48" speed="1.1" color="#FACC15"></l-helix>
            <p className="text-sm font-semibold text-white">{text}</p>
          </div>
        </div>
      )}
    </>
  );
}
