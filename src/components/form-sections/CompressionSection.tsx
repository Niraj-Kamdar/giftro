import { SectionHeader } from "./SectionHeader";
import { type FormSectionProps, createUpdateCompression } from "./types";

const COLOR_OPTIONS = [16, 32, 64, 128, 256] as const;
const OPTIMIZATION_LEVELS = [1, 2, 3] as const;

export function CompressionSection({ config, onChange }: FormSectionProps) {
  const updateCompression = createUpdateCompression(config, onChange);

  return (
    <section>
      <SectionHeader title="Compression" />
      <div className="space-y-4">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white/70">
            Enable Compression
          </label>
          <button
            onClick={() =>
              updateCompression("enabled", !config.gif.compression.enabled)
            }
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
              config.gif.compression.enabled ? "bg-lavender-500" : "bg-white/20"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                config.gif.compression.enabled
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {config.gif.compression.enabled && (
          <>
            {/* Lossy Compression Slider */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Lossy: {config.gif.compression.lossy}
              </label>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={config.gif.compression.lossy}
                onChange={(e) =>
                  updateCompression("lossy", Number(e.target.value))
                }
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lavender-500"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>None (0)</span>
                <span>High (200)</span>
              </div>
              <p className="text-xs text-white/40 mt-1">
                Recommended: 30-80. Higher = smaller file, more artifacts.
              </p>
            </div>

            {/* Optimization Level */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Optimization Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {OPTIMIZATION_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => updateCompression("optimizationLevel", level)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                      config.gif.compression.optimizationLevel === level
                        ? "border-lavender-500 bg-lavender-500/20 text-lavender-400"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                    }`}
                  >
                    O{level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-2">
                O1: Fast, O2: Balanced, O3: Max compression (slow)
              </p>
            </div>

            {/* Color Reduction */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Reduce Colors
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((num) => (
                  <button
                    key={num}
                    onClick={() => updateCompression("colors", num)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                      config.gif.compression.colors === num
                        ? "border-lavender-500 bg-lavender-500/20 text-lavender-400"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => updateCompression("colors", null)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    config.gif.compression.colors === null
                      ? "border-lavender-500 bg-lavender-500/20 text-lavender-400"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                  }`}
                >
                  Off
                </button>
              </div>
              <p className="text-xs text-white/40 mt-2">
                Fewer colors = smaller file size
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
