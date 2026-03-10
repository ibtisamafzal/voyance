interface BrandMarkProps {
  size?: number;
  className?: string;
}

interface BrandLogoProps {
  showText?: boolean;
  iconSize?: number;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function BrandMark({ size = 32, className = '' }: BrandMarkProps) {
  return (
    <div
      className={`relative rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: 'rgba(15, 118, 110, 0.08)',
        border: '1.5px solid rgba(15, 118, 110, 0.22)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.45)',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-[16%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="7.4" stroke="var(--accent)" strokeWidth="2.2" />
        <circle cx="12" cy="12" r="2.35" fill="var(--accent)" />
      </svg>
    </div>
  );
}

export function BrandLogo({
  showText = true,
  iconSize = 32,
  className = '',
  iconClassName = '',
  textClassName = 'text-lg',
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <BrandMark size={iconSize} className={iconClassName} />
      {showText && (
        <span
          className={`${textClassName} font-bold tracking-tight`}
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-geist)' }}
        >
          Voyance
        </span>
      )}
    </div>
  );
}
