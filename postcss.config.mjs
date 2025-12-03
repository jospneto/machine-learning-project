/** @type {import('cssnano-preset-advanced').Options} */
const cssnanoPresetAdvancedConfig = {
  discardComments: { removeAll: true },
};

/** @type {import('cssnano').Options} */
const cssnanoConfig = {
  preset: ['cssnano-preset-advanced', cssnanoPresetAdvancedConfig],
};

/** @type {import('postcss-load-config').Config} */
const postcssConfig = {
  plugins: {
    '@tailwindcss/postcss': {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: cssnanoConfig } : {}),
  },
};

export default postcssConfig;
