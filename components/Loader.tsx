'use client';

import { Loader2 } from 'lucide-react';

interface LoaderProps {
  isLoading: boolean;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  overlay?: boolean;
}

export default function Loader({
  isLoading,
  children,
  size = 'md',
  text,
  overlay = false,
}: LoaderProps) {
  if (!isLoading) return children;

  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }[size];

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className={`${sizeClass} animate-spin text-yellow-400`} />
          {text && <p className="text-white font-semibold">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Loader2 className={`${sizeClass} animate-spin text-yellow-400`} />
      {text && <span className="text-sm font-medium">{text}</span>}
    </div>
  );
}
