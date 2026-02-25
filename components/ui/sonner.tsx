"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-2xl border border-white/10 bg-neutral-900/95 text-white shadow-2xl backdrop-blur-xl",
          title: "text-sm font-semibold text-white",
          description: "text-xs text-gray-400",
          icon: "text-yellow-400",
          actionButton:
            "bg-yellow-400 text-neutral-900 hover:bg-yellow-300 rounded-lg px-3 py-1 text-xs font-semibold",
          cancelButton:
            "bg-white/5 text-gray-200 hover:bg-white/10 rounded-lg px-3 py-1 text-xs font-semibold",
          closeButton:
            "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
