interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
      {title}
    </h3>
  );
}
