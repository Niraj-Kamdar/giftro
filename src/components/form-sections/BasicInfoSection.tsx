import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { type FormSectionProps, createUpdateConfig } from "./types";

export function BasicInfoSection({ config, onChange }: FormSectionProps) {
  const updateConfig = createUpdateConfig(config, onChange);

  return (
    <section>
      <SectionHeader title="Basic Info" />
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
  );
}
