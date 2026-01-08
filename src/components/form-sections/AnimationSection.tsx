import { SectionHeader } from "./SectionHeader";
import { type FormSectionProps, createUpdateBackground } from "./types";
import { type BackgroundType, COLOR_PRESETS } from "../../lib/types";

const BACKGROUND_OPTIONS: { value: BackgroundType; label: string }[] = [
  { value: "particle", label: "Particles" },
  { value: "matrix", label: "Matrix" },
  { value: "gameoflife", label: "Game of Life" },
  { value: "plain", label: "Plain" },
];

export function AnimationSection({ config, onChange }: FormSectionProps) {
  const updateBackground = createUpdateBackground(config, onChange);

  return (
    <section>
      <SectionHeader title="Animation" />
      <div className="space-y-4">
        {/* Background Type */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Background Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {BACKGROUND_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateBackground("type", option.value)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  config.background.type === option.value
                    ? "border-lavender-500 bg-lavender-500/20 text-lavender-400"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Animation Color
          </label>
          <div className="space-y-3">
            {/* Preset colors */}
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => updateBackground("color", preset.value)}
                  title={preset.name}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    config.background.color === preset.value
                      ? "border-white scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: preset.value }}
                />
              ))}
            </div>
            {/* Custom color picker */}
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.background.color}
                onChange={(e) => updateBackground("color", e.target.value)}
                className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={config.background.color}
                onChange={(e) => updateBackground("color", e.target.value)}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-lavender-500"
                placeholder="#9b5de5"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
