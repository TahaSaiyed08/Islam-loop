// Original flat icons for the sidebar (the upstream art was removed).

const Learn = () => (
  <svg viewBox="0 0 32 32" aria-hidden className="size-8 shrink-0">
    <path
      d="M4 15 16 4.5 28 15v12a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 4 27Z"
      fill="#14A3A3"
    />
    <path
      d="M4 15 16 4.5 28 15"
      fill="none"
      stroke="#0B7C80"
      strokeWidth="3"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <rect x="12.5" y="18.5" width="7" height="11" rx="2" fill="#F2A93B" />
  </svg>
);

const Compass = () => (
  <svg viewBox="0 0 32 32" aria-hidden className="size-8 shrink-0">
    <circle cx="16" cy="16" r="13.5" fill="#F2A93B" />
    <circle cx="16" cy="16" r="10" fill="#FFF1D6" />
    <path d="m16 7.5 3.4 8.5H12.6Z" fill="#F2554C" />
    <path d="m16 24.5-3.4-8.5h6.8Z" fill="#AFAFAF" />
    <circle cx="16" cy="16" r="2" fill="#4B4B4B" />
  </svg>
);

const Books = () => (
  <svg viewBox="0 0 32 32" aria-hidden className="size-8 shrink-0">
    <rect x="4" y="6" width="7" height="22" rx="1.5" fill="#F2554C" />
    <rect x="12.5" y="9" width="7" height="19" rx="1.5" fill="#14A3A3" />
    <rect
      x="20"
      y="8"
      width="7"
      height="21"
      rx="1.5"
      fill="#8B5CF6"
      transform="rotate(-12 23.5 18.5)"
    />
    <rect x="5.5" y="10" width="4" height="2" rx="1" fill="#fff" opacity=".7" />
    <rect x="14" y="13" width="4" height="2" rx="1" fill="#fff" opacity=".7" />
  </svg>
);

const Info = () => (
  <svg viewBox="0 0 32 32" aria-hidden className="size-8 shrink-0">
    <circle cx="16" cy="16" r="13.5" fill="#8B5CF6" />
    <circle cx="16" cy="10" r="2.4" fill="#fff" />
    <rect x="13.8" y="14" width="4.4" height="10.5" rx="2.2" fill="#fff" />
  </svg>
);

const Gear = () => (
  <svg viewBox="0 0 32 32" aria-hidden className="size-8 shrink-0">
    <circle
      cx="16"
      cy="16"
      r="10.5"
      fill="none"
      stroke="#AFAFAF"
      strokeWidth="6"
      strokeDasharray="4.1 4.1"
    />
    <circle cx="16" cy="16" r="8.5" fill="#AFAFAF" />
    <circle cx="16" cy="16" r="3.5" fill="#fff" />
  </svg>
);

export const NAV_ICONS = {
  route: Learn,
  compass: Compass,
  library: Books,
  info: Info,
  settings: Gear,
};
