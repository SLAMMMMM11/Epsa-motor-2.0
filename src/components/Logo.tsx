interface LogoProps {
  className?: string;
  variant?: "light" | "dark" | "blue-only";
}

/** Logo oficial EPSA (assets del proyecto anterior). */
export default function Logo({ className = "w-10 h-10", variant = "light" }: LogoProps) {
  return (
    <img
      src="/assets/media/images/logo_epsa2.png"
      alt="EPSA Motor"
      className={`${className} object-contain`}
      style={variant === "dark" ? { filter: "brightness(0.85)" } : undefined}
    />
  );
}

