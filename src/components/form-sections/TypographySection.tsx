import { SectionHeader } from "./SectionHeader";
import { type FormSectionProps, createUpdateFont } from "./types";

const FONT_OPTIONS: { value: "mono" | "sans" | "serif"; label: string }[] = [
  { value: "mono", label: "Monospace" },
  { value: "sans", label: "Sans Serif" },
  { value: "serif", label: "Serif" },
];

export function TypographySection({ config, onChange }: FormSectionProps) {
  const updateFont = createUpdateFont(config, onChange);

  return (
    <section>
      <SectionHeader title="Typography" />
      <div className="space-y-4">
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Font Family
          </label>
          <div className="grid grid-cols-3 gap-2">
            {FONT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFont("family", option.value)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  config.font.family === option.value
                    ? "border-lavender-500 bg-lavender-500/20 text-lavender-400"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Style (Bold/Italic) */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Font Style
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => updateFont("bold", !config.font.bold)}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-bold transition-all ${
                config.font.bold
                  ? "border-lavender-500 bg-lavender-500/20 text-lavender-400"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
              }`}
            >
              Bold
            </button>
            <button
              onClick={() => updateFont("italic", !config.font.italic)}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm italic transition-all ${
                config.font.italic
                  ? "border-lavender-500 bg-lavender-500/20 text-lavender-400"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
              }`}
            >
              Italic
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Font Size: {config.font.size}px
          </label>
          <input
            type="range"
            min="16"
            max="32"
            value={config.font.size}
            onChange={(e) => updateFont("size", Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lavender-500"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>16px</span>
            <span>32px</span>
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Text Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.font.color}
              onChange={(e) => updateFont("color", e.target.value)}
              className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={config.font.color}
              onChange={(e) => updateFont("color", e.target.value)}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-lavender-500"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
