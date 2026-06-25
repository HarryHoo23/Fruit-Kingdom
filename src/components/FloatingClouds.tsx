export const FloatingClouds = () => (
  <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
    <span className="absolute left-[-8%] top-[9%] animate-cloud-drift text-[58px] opacity-80 drop-shadow-cloud">
      ☁️
    </span>
    <span className="absolute left-[68%] top-[26%] animate-cloud-drift-slow text-[42px] opacity-80 drop-shadow-cloud">
      ☁️
    </span>
    <span className="absolute bottom-[16%] left-[6%] animate-cloud-drift-slower text-5xl opacity-80 drop-shadow-cloud">
      ☁️
    </span>
  </div>
);
