import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ShellProps {
  children: ReactNode;
  nav: ReactNode;
  action: ReactNode;
  bedtime: boolean;
}

export const Shell = ({ children, nav, action, bedtime }: ShellProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={[
        "min-h-screen overflow-x-hidden bg-[size:auto_auto] font-fruit transition-[background-color,filter] duration-[450ms] ease-out",
        bedtime
          ? "animate-bg-scroll-slow bg-fruit-shell-bedtime"
          : "animate-bg-scroll bg-fruit-shell",
      ].join(" ")}
    >
      <header className="sticky top-0 z-10 flex min-h-[74px] items-center gap-[18px] border-b border-fruit-border-light/80 bg-fruit-parchment/75 px-[clamp(16px,4vw,42px)] py-3.5 backdrop-blur-[14px] max-[880px]:flex-wrap">
        <a
          className="inline-flex items-center gap-2.5 whitespace-nowrap text-[22px] font-black text-fruit-text text-shadow-brand max-[560px]:text-lg"
          href="/"
        >
          <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-fruit-cream shadow-brand-lift">
            🍓
          </span>
          <span>{t("common.appName")}</span>
        </a>
        <nav className="ml-auto flex items-center gap-2 [&>a.active]:bg-fruit-sky [&>a.active]:text-fruit-paper [&>a:hover]:bg-fruit-sky [&>a:hover]:text-fruit-paper [&>a]:inline-flex [&>a]:h-[38px] [&>a]:items-center [&>a]:rounded-[14px] [&>a]:px-4 [&>a]:font-extrabold [&>a]:text-fruit-soft [&>a]:transition max-[880px]:order-3 max-[880px]:ml-0 max-[880px]:w-full">
          {nav}
        </nav>
        <div className="flex items-center gap-2 max-[560px]:w-full max-[560px]:flex-col">
          {action}
        </div>
      </header>
      <main className="relative z-[1]">{children}</main>
    </div>
  );
};
