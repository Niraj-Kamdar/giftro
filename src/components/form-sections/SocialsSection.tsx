import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import {
  type FormSectionProps,
  createUpdateConfig,
  createSocialHelpers,
} from "./types";
import { type SocialType, type Social, SOCIAL_CONFIG } from "../../lib/types";

const AVAILABLE_SOCIALS: SocialType[] = [
  "x",
  "sns",
  "ens",
  "youtube",
  "github",
];

export function SocialsSection({ config, onChange }: FormSectionProps) {
  const [showAddSocial, setShowAddSocial] = useState(false);

  const updateConfig = createUpdateConfig(config, onChange);
  const { updateSocial, removeSocial } = createSocialHelpers(config, onChange);

  const addSocial = (type: SocialType) => {
    const newSocial: Social = { type, handle: "", enabled: true };
    updateConfig("socials", [...config.socials, newSocial]);
    setShowAddSocial(false);
  };

  // Get socials that aren't already added
  const availableSocialsToAdd = AVAILABLE_SOCIALS.filter(
    (type) => !config.socials.some((s) => s.type === type),
  );

  return (
    <section>
      <SectionHeader title="Socials (Optional)" />
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
  );
}
