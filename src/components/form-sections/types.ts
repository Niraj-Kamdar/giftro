import {
  type AnimationConfig,
  type GifSettings,
  type CompressionSettings,
  type Social,
} from "../../lib/types";

export interface FormSectionProps {
  config: AnimationConfig;
  onChange: (config: AnimationConfig) => void;
}

// Helper functions for updating nested config properties
export function createUpdateConfig(
  config: AnimationConfig,
  onChange: (config: AnimationConfig) => void,
) {
  return <K extends keyof AnimationConfig>(
    key: K,
    value: AnimationConfig[K],
  ) => {
    onChange({ ...config, [key]: value });
  };
}

export function createUpdateFont(
  config: AnimationConfig,
  onChange: (config: AnimationConfig) => void,
) {
  return <K extends keyof AnimationConfig["font"]>(
    key: K,
    value: AnimationConfig["font"][K],
  ) => {
    onChange({
      ...config,
      font: { ...config.font, [key]: value },
    });
  };
}

export function createUpdateBackground(
  config: AnimationConfig,
  onChange: (config: AnimationConfig) => void,
) {
  return <K extends keyof AnimationConfig["background"]>(
    key: K,
    value: AnimationConfig["background"][K],
  ) => {
    onChange({
      ...config,
      background: { ...config.background, [key]: value },
    });
  };
}

export function createUpdateGif(
  config: AnimationConfig,
  onChange: (config: AnimationConfig) => void,
) {
  return <K extends keyof GifSettings>(key: K, value: GifSettings[K]) => {
    onChange({
      ...config,
      gif: { ...config.gif, [key]: value },
    });
  };
}

export function createUpdateCompression(
  config: AnimationConfig,
  onChange: (config: AnimationConfig) => void,
) {
  return <K extends keyof CompressionSettings>(
    key: K,
    value: CompressionSettings[K],
  ) => {
    onChange({
      ...config,
      gif: {
        ...config.gif,
        compression: { ...config.gif.compression, [key]: value },
      },
    });
  };
}

export function createSocialHelpers(
  config: AnimationConfig,
  onChange: (config: AnimationConfig) => void,
) {
  const updateConfig = createUpdateConfig(config, onChange);

  return {
    updateSocial: (index: number, updates: Partial<Social>) => {
      const newSocials = [...config.socials];
      newSocials[index] = { ...newSocials[index], ...updates };
      updateConfig("socials", newSocials);
    },
    removeSocial: (index: number) => {
      const newSocials = config.socials.filter((_, i) => i !== index);
      updateConfig("socials", newSocials);
    },
  };
}
