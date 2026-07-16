export function PageHeader({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
}) {
  return (
    // pt-1 keeps the outlined title clear of the sticky top bar on mobile
    <div className="mb-6 pt-1">
      <div className="mb-1 flex items-center gap-3">
        <span className="wj-dots"><i /><i /><i /></span>
      </div>
      <h1 className="wj-outline font-display text-3xl sm:text-4xl">
        <span className="mr-2" style={{ WebkitTextStroke: "0px" }}>{emoji}</span>
        {title}
      </h1>
      {subtitle && <p className="font-hand mt-1 text-lg text-ink-soft">{subtitle}</p>}
    </div>
  );
}
