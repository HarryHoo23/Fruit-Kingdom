import { forwardRef } from "react";

type BookCoverProps = {
  title: string;
  subtitle: string;
  back?: boolean;
  backMessage?: string;
};

export const BookCover = forwardRef<HTMLDivElement, BookCoverProps>(
  ({ title, subtitle, back = false, backMessage }, ref) => (
    <div ref={ref} className="memory-book-page memory-book-cover" data-density="hard">
      <div className="memory-cover-inner">
        <div className="memory-cover-ornament" aria-hidden="true">
          ✦
        </div>
        <span className="text-[clamp(48px,7vw,78px)] drop-shadow-emoji" aria-hidden="true">
          {back ? "🏡" : "📖"}
        </span>
        <p className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-fruit-parchment/80">
          Fruit Kingdom
        </p>
        <h2 className="mt-2 max-w-sm text-center text-[clamp(34px,5vw,58px)] font-black leading-[0.95] text-fruit-parchment text-shadow-fruit">
          {back ? backMessage : title}
        </h2>
        {!back && (
          <p className="mt-5 max-w-xs text-center text-[clamp(13px,1.6vw,16px)] font-bold leading-relaxed text-fruit-parchment/85">
            {subtitle}
          </p>
        )}
        <div className="mt-8 h-px w-24 bg-fruit-parchment/50" />
        <p className="mt-3 text-sm font-black text-fruit-parchment/75">Hailey's Memory Book</p>
      </div>
    </div>
  ),
);

BookCover.displayName = "BookCover";
