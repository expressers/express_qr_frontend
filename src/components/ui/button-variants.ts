import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium select-none transition-[transform,background-color,color,border-color,box-shadow,opacity] duration-(--dur-fast) ease-(--ease-out) active:scale-[.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Inversion: ink on paper in light, paper on ink in dark
        default: "bg-primary text-primary-foreground hover:bg-primary/88",
        // Error / destructive: the one functional hue. Outline at rest, fills on hover.
        destructive:
          "border-[1.5px] border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground",
        outline:
          "border border-input bg-card text-foreground hover:bg-muted",
        secondary:
          "border border-input bg-card text-secondary-foreground hover:bg-muted",
        ghost: "hover:bg-muted hover:text-accent-foreground",
        link: "text-primary underline underline-offset-4 decoration-1 hover:decoration-2",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 px-6 has-[>svg]:px-4",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
