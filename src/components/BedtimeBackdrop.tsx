export const BedtimeBackdrop = ({ active }: { active: boolean }) => (
  <div
    className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-[450ms] ease-out ${active ? "opacity-100" : "opacity-0"}`}
    aria-hidden="true"
  >
    <div className="absolute right-[9vw] top-28 animate-float-moon text-[58px] drop-shadow-moon">
      🌙
    </div>
    <span className="absolute left-[14%] top-[22%] animate-twinkle text-2xl text-bedtime-star">
      ✦
    </span>
    <span className="absolute right-[18%] top-[36%] animate-twinkle text-2xl text-bedtime-star [animation-delay:0.8s]">
      ✧
    </span>
    <span className="absolute bottom-[23%] left-[67%] animate-twinkle text-2xl text-bedtime-star [animation-delay:1.4s]">
      ✦
    </span>
  </div>
);
