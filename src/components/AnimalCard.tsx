import type { HTMLAttributes, ReactNode } from "react";

export type AnimalCardPattern =
  | "default"
  | "pink"
  | "blue"
  | "yellow"
  | "green"
  | "purple"
  | "orange"
  | "teal";

interface AnimalCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  pattern?: AnimalCardPattern;
  dashed?: boolean;
}

const patternClasses: Record<AnimalCardPattern, string> = {
  default: "border-fruit-cardBorder bg-fruit-cream",
  pink: "border-fruit-strawberry bg-fruit-appleLight",
  blue: "border-fruit-blue bg-fruit-blueLight",
  yellow: "border-fruit-banana bg-fruit-bananaLight",
  green: "border-fruit-kiwi bg-fruit-kiwiLight",
  purple: "border-fruit-grape bg-fruit-grapeLight",
  orange: "border-fruit-orange bg-fruit-orangeLight",
  teal: "border-fruit-teal bg-fruit-tealLight",
};

export const AnimalCard = ({
  children,
  pattern = "default",
  dashed = false,
  className = "",
  ...props
}: AnimalCardProps) => (
  <div
    className={[
      "rounded-fruit p-[18px_22px] text-fruit-text transition duration-300 ease-out hover:-translate-y-0.5",
      dashed
        ? "border-2 border-dashed border-fruit-cardDashed bg-fruit-card shadow-none hover:shadow-none"
        : "border-[1.5px] bg-animal-dots bg-[length:28px_28px,14px_14px] bg-[position:0_0,7px_7px] shadow-fruit hover:shadow-fruit-lg",
      patternClasses[pattern],
      className,
    ].join(" ")}
    {...props}
  >
    {children}
  </div>
);
