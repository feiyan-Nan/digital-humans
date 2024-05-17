import { defineConfig, presetAttributify, presetUno, presetTypography } from 'unocss';
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx';

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetTypography()],
  transformers: [transformerAttributifyJsx()],
});
