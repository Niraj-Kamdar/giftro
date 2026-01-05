import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type AnimationConfig,
  type BackgroundType,
  type SocialType,
  type Social,
  type GifSettings,
  SOCIAL_CONFIG,
  COLOR_PRESETS,
} from "../lib/types";

interface InputFormProps {
  config: AnimationConfig;
  onChange: (config: AnimationConfig) => void;
}

const BACKGROUND_OPTIONS: { value: BackgroundType; label: string }[] = [
  { value: "particle", label: "Particles" },
  { value: "matrix", label: "Matrix" },
  { value: "gameoflife", label: "Game of Life" },
  { value: "plain", label: "Plain" },
];

const FONT_OPTIONS: { value: "mono" | "sans" | "serif"; label: string }[] = [
  { value: "mono", label: "Monospace" },
  { value: "sans", label: "Sans Serif" },
  { value: "serif", label: "Serif" },
];

const AVAILABLE_SOCIALS: SocialType[] = [
  "x",
  "sns",
  "ens",
  "youtube",
  "github",
];

export function InputForm({ config, onChange }: InputFormProps) {
  const [showAddSocial, setShowAddSocial] = useState(false);

  const updateConfig = <K extends keyof AnimationConfig>(
    key: K,
    value: AnimationConfig[K],
  ) => {
    onChange({ ...config, [key]: value });
  };

  const updateFont = <K extends keyof AnimationConfig["font"]>(
    key: K,
    value: AnimationConfig["font"][K],
  ) => {
    onChange({
      ...config,
      font: { ...config.font, [key]: value },
    });
  };

  const updateBackground = <K extends keyof AnimationConfig["background"]>(
    key: K,
    value: AnimationConfig["background"][K],
  ) => {
    onChange({
      ...config,
      background: { ...config.background, [key]: value },
    });
  };

  const updateGif = <K extends keyof GifSettings>(
    key: K,
    value: GifSettings[K],
  ) => {
    onChange({
      ...config,
      gif: { ...config.gif, [key]: value },
    });
  };

  const updateSocial = (index: number, updates: Partial<Social>) => {
    const newSocials = [...config.socials];
    newSocials[index] = { ...newSocials[index], ...updates };
    updateConfig("socials", newSocials);
  };

  const addSocial = (type: SocialType) => {
    const newSocial: Social = { type, handle: "", enabled: true };
    updateConfig("socials", [...config.socials, newSocial]);
    setShowAddSocial(false);
  };

  const removeSocial = (index: number) => {
    const newSocials = config.socials.filter((_, i) => i !== index);
    updateConfig("socials", newSocials);
  };

  // Get socials that aren't already added
  const availableSocialsToAdd = AVAILABLE_SOCIALS.filter(
    (type) => !config.socials.some((s) => s.type === type),
  );

  return (
    <div className="space-y-8">
      {/* Basic Info Section */}
      <section>
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
          Basic Info
        </h3>
        <div className="space-y-4">
          {/* Intro Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-white/70 mb-2">
              Intro Text
            </label>
            <input
              type="text"
              value={config.introText}
              onChange={(e) => updateConfig("introText", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-lavender-500 transition-colors"
              placeholder="Hey there! I am"
            />
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-medium text-white/70 mb-2">
              Name
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => updateConfig("name", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-lavender-500 transition-colors"
              placeholder="Niraj"
            />
          </motion.div>

          {/* Role */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-white/70 mb-2">
              Role
            </label>
            <input
              type="text"
              value={config.role}
              onChange={(e) => updateConfig("role", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-lavender-500 transition-colors"
              placeholder="Software Engineer"
            />
          </motion.div>
        </div>
      </section>

      {/* Socials Section */}
      <section>
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
          Socials (Optional)
        </h3>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {config.socials.map((social, index) => {
              const socialConfig = SOCIAL_CONFIG[social.type];
              return (
                <motion.div
                  key={`${social.type}-${index}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2"
                >
                  {/* Enable checkbox */}
                  <input
                    type="checkbox"
                    checked={social.enabled}
                    onChange={(e) =>
                      updateSocial(index, { enabled: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-lavender-500 focus:ring-lavender-500/50"
                  />

                  {/* Handle input */}
                  <div className="flex-1 flex">
                    {socialConfig.prefix && (
                      <span className="px-3 py-2 bg-white/10 border border-r-0 border-white/10 rounded-l-lg text-white/40 text-sm">
                        {socialConfig.prefix}
                      </span>
                    )}
                    <input
                      type="text"
                      value={social.handle}
                      onChange={(e) =>
                        updateSocial(index, { handle: e.target.value })
                      }
                      className={`flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-lavender-500 transition-colors text-sm ${
                        socialConfig.prefix && socialConfig.suffix
                          ? ""
                          : socialConfig.prefix
                            ? "rounded-r-lg"
                            : socialConfig.suffix
                              ? "rounded-l-lg"
                              : "rounded-lg"
                      }`}
                      placeholder={socialConfig.label}
                      disabled={!social.enabled}
                    />
                    {socialConfig.suffix && (
                      <span className="px-3 py-2 bg-white/10 border border-l-0 border-white/10 rounded-r-lg text-white/40 text-sm">
                        {socialConfig.suffix}
                      </span>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeSocial(index)}
                    className="p-2 text-white/40 hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add Social Button */}
          {availableSocialsToAdd.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowAddSocial(!showAddSocial)}
                className="w-full px-4 py-2 border border-dashed border-white/20 rounded-lg text-white/50 hover:border-white/40 hover:text-white/70 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Social
              </button>

              <AnimatePresence>
                {showAddSocial && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-lg overflow-hidden z-10"
                  >
                    {availableSocialsToAdd.map((type) => (
                      <button
                        key={type}
                        onClick={() => addSocial(type)}
                        className="w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/5 transition-colors"
                      >
                        {SOCIAL_CONFIG[type].label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Typography Section */}
      <section>
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
          Typography
        </h3>
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

      {/* Animation Section */}
      <section>
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
          Animation
        </h3>
        <div className="space-y-4">
          {/* Speed */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Animation Speed: {Math.ceil(1 / config.speed)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={config.speed}
              onChange={(e) => updateConfig("speed", Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lavender-500"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>Fast</span>
              <span>Slow</span>
            </div>
          </div>

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

      {/* GIF Settings Section */}
      <section>
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
          GIF Output
        </h3>
        <div className="space-y-4">
          {/* FPS */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Frame Rate
            </label>
            <div className="grid grid-cols-4 gap-2">
              {([6, 8, 10, 12] as const).map((fps) => (
                <button
                  key={fps}
                  onClick={() => updateGif("fps", fps)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    config.gif.fps === fps
                      ? "border-lavender-500 bg-lavender-500/20 text-lavender-400"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                  }`}
                >
                  {fps} FPS
                </button>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-2">
              Lower FPS = smaller file size
            </p>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Quality:{" "}
              {config.gif.quality <= 10
                ? "High"
                : config.gif.quality <= 20
                  ? "Medium"
                  : "Low"}
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={config.gif.quality}
              onChange={(e) => updateGif("quality", Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lavender-500"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>High (larger)</span>
              <span>Low (smaller)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
