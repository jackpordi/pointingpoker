module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    "plugin:react/recommended"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: "latest",
    project: "./tsconfig.json",
    ecmaFeatures: { impliedStrict: true },
  },
  plugins: ['@typescript-eslint'],
  rules: {
    "@typescript-eslint/quotes": [ "error", "double" ],
    quotes: "off",
    "array-bracket-spacing": [ "error", "always"],
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "react/prop-types": "off",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "no-restricted-syntax": "off",
    "import/prefer-default-export": "off",
    "no-void": "off",
    "class-methods-use-this": "off",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ]
  },
  root: true,
};
