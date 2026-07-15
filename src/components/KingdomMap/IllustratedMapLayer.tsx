import fruitKingdomMapPng from "../../assets/map/fruit-kingdom-map.png";
import fruitKingdomMapWebp from "../../assets/map/fruit-kingdom-map.webp";

type IllustratedMapLayerProps = {
  alt: string;
  bedtime: boolean;
};

export const IllustratedMapLayer = ({ alt, bedtime }: IllustratedMapLayerProps) => (
  <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-map-land">
    <picture>
      <source srcSet={fruitKingdomMapWebp} type="image/webp" />
      <img
        src={fruitKingdomMapPng}
        alt={alt}
        width="1536"
        height="1024"
        loading="lazy"
        decoding="async"
        className={`size-full object-contain transition-[filter] duration-500 ${bedtime ? "brightness-[0.72] saturate-[0.82]" : ""}`}
      />
    </picture>
    {bedtime && (
      <div
        className="pointer-events-none absolute inset-0 bg-bedtime-background/35"
        aria-hidden="true"
      >
        <span className="absolute left-[12%] top-[12%] animate-twinkle text-bedtime-star motion-reduce:animate-none">
          ✦
        </span>
        <span className="absolute right-[18%] top-[16%] animate-twinkle text-bedtime-star [animation-delay:0.8s] motion-reduce:animate-none">
          ✧
        </span>
        <span className="absolute right-[32%] top-[35%] animate-twinkle text-bedtime-star [animation-delay:1.4s] motion-reduce:animate-none">
          ✦
        </span>
        <span className="absolute right-[8%] top-[8%] text-4xl text-bedtime-moon drop-shadow-moon">
          ☾
        </span>
      </div>
    )}
  </div>
);
