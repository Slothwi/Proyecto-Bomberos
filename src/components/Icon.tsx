import { ReactNode } from "react";
import companyLogo from "../assets/logo-bomberos.png";

export type IconName =
  | "alert"
  | "arrow"
  | "bell"
  | "calendar"
  | "check"
  | "clock"
  | "close"
  | "fire"
  | "helmet"
  | "location"
  | "lock"
  | "menu"
  | "plus"
  | "radio"
  | "search"
  | "shield"
  | "spark"
  | "truck"
  | "users";

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    alert: (
      <>
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M10.3 3.6 2.4 17.2A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.8L13.7 3.6a2 2 0 0 0-3.4 0Z" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    fire: (
      <path d="M12 22c4.4 0 7-3.1 7-7.1 0-2.3-1.1-4.8-3.4-7.4.1 2.1-.8 3.4-2 4.1.2-3.4-1.8-6.9-5-9.6.2 3.4-3.6 6.1-3.6 11.9C5 18.4 7.7 22 12 22Zm0-2.4c-1.7 0-3-1.3-3-3 0-1.4.8-2.6 2.3-4.2.1 1.2.7 2 1.5 2.5.5-.7.8-1.5.8-2.4 1 1.3 1.5 2.5 1.5 3.8 0 1.9-1.3 3.3-3.1 3.3Z" />
    ),
    helmet: (
      <>
        <path d="M4 14a8 8 0 0 1 16 0" />
        <path d="M2 14h20v3H2zM9 7v7M15 7v7" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    plus: <path d="M12 5v14M5 12h14" />,
    radio: (
      <>
        <circle cx="12" cy="12" r="2" />
        <path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    shield: <path d="M12 22S20 18 20 11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />,
    spark: (
      <path d="m12 3-1.1 4.2A5.2 5.2 0 0 1 7.2 11L3 12l4.2 1.1a5.2 5.2 0 0 1 3.7 3.7L12 21l1.1-4.2a5.2 5.2 0 0 1 3.7-3.7L21 12l-4.2-1a5.2 5.2 0 0 1-3.7-3.8Z" />
    ),
    truck: (
      <>
        <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
        <path d="M5 10h6M8 7v6" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 1 0 7.8" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  );
}

export function Emblem({ watermark = false }: { watermark?: boolean }) {
  return (
    <svg
      aria-hidden={watermark ? "true" : undefined}
      aria-label={watermark ? undefined : "Emblema oficial Bomba España, 10ª Compañía"}
      className={watermark ? "watermark" : "emblem"}
      role={watermark ? undefined : "img"}
      viewBox="0 0 500 500"
    >
      <image
        height="500"
        href={companyLogo}
        preserveAspectRatio="xMidYMid meet"
        width="500"
      />
    </svg>
  );
}
