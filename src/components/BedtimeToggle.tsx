import { useBedtime } from "../hooks/useBedtime";

export const BedtimeToggle = () => {
  const { bedtime, setBedtime } = useBedtime();

  return (
    <button
      className={[
        "relative inline-flex h-[42px] min-w-[126px] items-center gap-2 rounded-full border-[2.5px] font-black text-fruit-paper shadow-switch-inner text-shadow-switch max-[560px]:w-full max-[560px]:justify-center",
        bedtime
          ? "border-bedtime-border bg-bedtime-purple p-[0_44px_0_14px]"
          : "border-fruit-switchBorder bg-fruit-switch p-[0_14px_0_44px]",
      ].join(" ")}
      type="button"
      role="switch"
      aria-checked={bedtime}
      aria-label="Bedtime mode"
      onClick={() => setBedtime(!bedtime)}
    >
      <span
        className={`absolute top-1/2 grid h-[29px] w-[29px] -translate-y-1/2 place-items-center rounded-full border-[2.5px] bg-fruit-cream transition-[left,border-color] duration-200 ease-out ${
          bedtime
            ? "left-[calc(100%-36px)] border-bedtime-border"
            : "left-[5px] border-fruit-switchBorder"
        }`}
      >
        {bedtime ? "🌙" : "☀️"}
      </span>
      <span>{bedtime ? "Bedtime" : "Daytime"}</span>
    </button>
  );
};
