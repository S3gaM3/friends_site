import Link from "next/link";
import type { ComponentProps, MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "ghost" | "link";

const variants: Record<Variant, string> = {
  primary:
    "bg-clay-deep text-paper hover:bg-clay shadow-[0_12px_28px_-14px_rgba(90,113,104,0.55)]",
  ghost: "bg-transparent text-ink border border-line hover:border-clay hover:text-clay-deep",
  link: "bg-transparent text-clay-deep px-0 py-0 underline-offset-4 hover:underline shadow-none",
};

type Shared = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = Shared &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = Shared & {
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] px-5 py-3 text-[0.95rem] font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-200 disabled:opacity-50 disabled:pointer-events-none";

export function Button(props: ButtonProps) {
  const { variant = "primary", className = "", children } = props;
  const classes = `${base} ${variants[variant]} ${className}`.trim();

  if ("href" in props && props.href) {
    const href = props.href;
    const external =
      /^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
    if (external) {
      return (
        <a href={href} className={classes} onClick={props.onClick} rel="noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={props.onClick}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
