import { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function Button({
  children,
  className = "",
  onClick,
  "aria-label": ariaLabel,
  title,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
  title?: string;
  type?: "button" | "submit";
}) {
  return (
    <button aria-label={ariaLabel} className={`button ${className}`} onClick={onClick} title={title} type={type}>
      {children}
    </button>
  );
}

export function Panel({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section className={`panel ${className}`} style={style}>
      {children}
    </section>
  );
}

export function SectionHeader({
  action,
  eyebrow,
  icon,
  title,
}: {
  action?: ReactNode;
  eyebrow?: string;
  icon: IconName;
  title: string;
}) {
  return (
    <div className="section-header">
      <div className="section-title-wrap">
        <span className="section-icon">
          <Icon name={icon} />
        </span>
        <div>
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <div className="section-title">{title}</div>
        </div>
      </div>
      {action}
    </div>
  );
}
