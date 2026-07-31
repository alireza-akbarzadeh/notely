type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  accent: string;
};

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className="card-elevated relative overflow-hidden rounded-2xl p-5">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums">
        {value}
      </div>
      {sub ? (
        <div className="mt-1 text-xs tabular-nums" style={{ color: accent }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}
