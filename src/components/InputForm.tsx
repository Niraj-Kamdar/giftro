import { type AnimationConfig } from "../lib/types";
import {
  BasicInfoSection,
  SocialsSection,
  TypographySection,
  AnimationSection,
  GifSettingsSection,
  CompressionSection,
} from "./form-sections";

interface InputFormProps {
  config: AnimationConfig;
  onChange: (config: AnimationConfig) => void;
}

export function InputForm({ config, onChange }: InputFormProps) {
  return (
    <div className="space-y-8">
      <BasicInfoSection config={config} onChange={onChange} />
      <SocialsSection config={config} onChange={onChange} />
      <TypographySection config={config} onChange={onChange} />
      <AnimationSection config={config} onChange={onChange} />
      <GifSettingsSection config={config} onChange={onChange} />
      <CompressionSection config={config} onChange={onChange} />
    </div>
  );
}
