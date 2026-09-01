/** Iconos SVG del sistema. `icon_key` del backend selecciona el trazo. */
export type IconName =
  | 'plumbing'
  | 'electricity'
  | 'locksmith'
  | 'waterproofing'
  | 'painting'
  | 'cleaning'
  | 'installations'
  | 'maintenance'
  | 'home'
  | 'search'
  | 'map-pin'
  | 'user'
  | 'chevron'
  | 'back'
  | 'calendar'
  | 'help'
  | 'check';

const PATHS: Record<IconName, JSX.Element> = {
  plumbing: <path d="M8 3v4M16 3v4M4 7h16v3a5 5 0 0 1-5 5h-1v6M9 15v6" />,
  electricity: <path d="M13 2 4 14h6l-1 8 9-12h-6z" />,
  locksmith: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="M10.9 10.9 21 21m-6-6 3-3" />
    </>
  ),
  waterproofing: <path d="M12 2c-4 4.4-6 7.7-6 10.4A6 6 0 0 0 12 19a6 6 0 0 0 6-6.6C18 9.7 16 6.4 12 2z" />,
  painting: (
    <path d="M3 21c1-1.6 2-2 3-2s2 .6 3 0 1-2 1-3-.7-2 0-3 5-3 8-6l3 3c-3 3-5 7-6 8s-2-.7-3 0-1 2-3 3-3-1-3-1z" />
  ),
  cleaning: (
    <>
      <path d="M6 3v6l-2 2v10h6V11l-2-2V3z" />
      <path d="M16 3l4 4-9 9-4-4z" />
    </>
  ),
  installations: (
    <>
      <rect x="4" y="9" width="16" height="7" rx="2" />
      <path d="M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M9 20v-4M15 20v-4" />
    </>
  ),
  maintenance: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z" />
    </>
  ),
  home: (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.6-4 5-6 8-6s6.4 2 8 6" />
    </>
  ),
  chevron: <path d="M9 6l6 6-6 6" />,
  back: <path d="M15 18l-6-6 6-6" />,
  calendar: (
    <>
      <path d="M9 3v4M15 3v4M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  help: (
    <>
      <path d="M12 18h.01M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.9.4-1.4 1-1.4 1.9v.3" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  check: <path d="M20 6L9 17l-5-5" />,
};

interface IconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function Icon({ name, size, strokeWidth = 1.7, className }: IconProps) {
  const path = PATHS[name as IconName] ?? PATHS.maintenance;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
