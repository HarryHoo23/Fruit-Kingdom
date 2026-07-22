type MemoryPhotoProps = {
  src: string;
  alt: string;
  objectPosition: string;
  scale: number;
};

export const MemoryPhoto = ({ src, alt, objectPosition, scale }: MemoryPhotoProps) => (
  <figure className="memory-photo relative min-h-0 flex-1 overflow-hidden rounded-fruit border-[5px] border-fruit-parchment bg-fruit-paper shadow-fruit">
    <img
      src={src}
      alt={alt}
      width="1536"
      height="1024"
      draggable="false"
      className="absolute inset-0 size-full object-cover"
      style={{ objectPosition, transform: `scale(${scale})` }}
    />
    <div
      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fruit-transparentInk/20 to-transparent"
      aria-hidden="true"
    />
  </figure>
);
