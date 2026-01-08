import { SectionHeader } from "./SectionHeader";
import { type FormSectionProps, createUpdateGif } from "./types";
import { type PlaybackSpeed } from "../../lib/types";

const PLAYBACK_SPEEDS: PlaybackSpeed[] = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];

export function GifSettingsSection({ config, onChange }: FormSectionProps) {
  const updateGif = createUpdateGif(config, onChange);

  return (
    <section>
      <SectionHeader title="GIF Output" />
      <div className="space-y-4">
        {/* Quality (FPS) */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Quality{" "}
            <span className="text-white/40">({config.gif.fps} FPS)</span>
          </label>
          <input
            type="range"
            min={4}
            max={20}
            value={config.gif.fps}
            onChange={(e) => updateGif("fps", Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lavender-500"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>Smaller file</span>
            <span>Smoother</span>
          </div>
        </div>

        {/* Playback Speed */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Playback Speed
          </label>
          <div className="flex flex-wrap gap-2">
            {PLAYBACK_SPEEDS.map((speed) => (
              <button
                key={speed}
                onClick={() => updateGif("playbackSpeed", speed)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  config.gif.playbackSpeed === speed
                    ? "border-lavender-500 bg-lavender-500/20 text-lavender-400"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
