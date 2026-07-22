type ParentLetterProps = {
  author: string;
  message: string;
  fromLabel: string;
  loveLabel: string;
};

export const ParentLetter = ({ author, message, fromLabel, loveLabel }: ParentLetterProps) => (
  <section className="rounded-fruit border border-fruit-cardDashed bg-fruit-parchment/65 p-[clamp(12px,2vw,18px)] shadow-fruit-sm">
    <h3 className="text-sm font-black text-fruit-primary">{fromLabel} ❤️</h3>
    <p className="mt-2 text-[clamp(11px,1.35vw,14px)] font-bold leading-relaxed text-fruit-muted">
      {message}
    </p>
    <p className="mt-2 text-right text-sm font-black text-fruit-text">
      {loveLabel},<br />
      {author}
    </p>
  </section>
);
