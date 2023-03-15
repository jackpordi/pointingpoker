module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: "latest",
    project: "./tsconfig.json",
    ecmaFeatures: { impliedStrict: true },
  },
  plugins: ['@typescript-eslint'],
  root: true,
};
