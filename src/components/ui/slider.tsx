
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    thumbColor?: string;
  }
>(({ className, orientation = "horizontal", thumbColor, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn(
      "relative flex touch-none select-none",
      orientation === "vertical" 
        ? "h-full flex-col items-center" 
        : "w-full items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track 
      className={cn(
        "relative overflow-hidden rounded-full bg-secondary",
        orientation === "vertical" 
          ? "w-2 h-full" 
          : "h-2 w-full"
      )}
    >
      <SliderPrimitive.Range 
        className={cn(
          "absolute bg-gradient-to-r from-neon-purple to-neon-pink",
          orientation === "vertical"
            ? "w-full"
            : "h-full"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className={cn(
        "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background shadow-[0_0_10px_rgba(255,255,255,0.7)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.9)]",
      )}
      style={{ backgroundColor: thumbColor || undefined }}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
