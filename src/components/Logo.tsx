interface LogoProps {
  className?: string;
  loading?: "eager" | "lazy";
  variant?: "adaptive" | "standard" | "inverse";
}

/** Logotipo oficial proporcionado por EPSA Motor. */
export default function Logo({
  className = "w-[180px] h-12",
  loading = "eager",
  variant = "adaptive",
}: LogoProps) {
  return (
    <span className={`${className} epsa-logo-wrap epsa-logo-wrap--${variant} inline-grid`}>
      <img
        src="/assets/media/images/epsa-motor-logo-transparente.png"
        alt="EPSA Motor, distribuidor autorizado Bajaj"
        className="epsa-logo epsa-logo--standard h-full w-full object-contain object-center"
        loading={loading}
        decoding="async"
        draggable={false}
      />
      <img
        src="/assets/media/images/epsa-motor-logo-claro.png"
        alt=""
        aria-hidden="true"
        className="epsa-logo epsa-logo--inverse h-full w-full object-contain object-center"
        loading={loading}
        decoding="async"
        draggable={false}
      />
    </span>
  );
}

