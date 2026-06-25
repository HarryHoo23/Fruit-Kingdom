import type { ButtonHTMLAttributes, ReactNode } from "react";

interface AnimalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "soft" | "danger";
}

const variantClasses: Record<NonNullable<AnimalButtonProps["variant"]>, string> = {
  primary:
    "border-fruit-paper bg-fruit-paper text-fruit-brown shadow-button-lift hover:shadow-button-hover active:shadow-button-press",
  soft: "border-fruit-border bg-fruit-paper text-fruit-brown shadow-fruit-sm hover:shadow-fruit",
  danger:
    "border-fruit-danger bg-fruit-apple text-fruit-paper shadow-danger-lift hover:shadow-danger-lift active:shadow-danger-press",
};

export const AnimalButton = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: AnimalButtonProps) => (
  <button
    className={[
      "inline-flex min-h-[45px] items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 px-5 font-black transition duration-200 ease-out hover:-translate-y-px active:translate-y-0.5 disabled:opacity-[0.55] max-[560px]:w-full",
      variantClasses[variant],
      className,
    ].join(" ")}
    type="button"
    {...props}
  >
    {children}
  </button>
);
