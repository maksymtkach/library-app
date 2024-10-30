import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginVue from 'eslint-plugin-vue';

export default {
  ignores: ['dist'], // Ігнорує папку dist
  files: ['**/*.{js,mjs,cjs,ts,vue}'], // Перевіряє файли із зазначеними розширеннями
  languageOptions: {
    globals: globals.browser,
    parser: tsParser, // Використання TypeScript парсера для файлів .ts
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': tseslint,
    vue: pluginVue,
  },
  rules: {
    // Ваші інші правила або рекомендовані
  },
  settings: [
    pluginJs.configs.recommended,
    tseslint.configs.recommended,
    pluginVue.configs['flat/essential'],
  ],
};
