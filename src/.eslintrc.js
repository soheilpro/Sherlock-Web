module.exports = {
  "env": {
    "node": true,
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json",
    "sourceType": "module"
  },
  "plugins": [
    "eslint-plugin-unicorn",
    "eslint-plugin-import",
    "@typescript-eslint",
  ],
  "rules": {
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": [
      "error",
      {
        "default": "array"
      }
    ],
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/consistent-type-assertions": "error",
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true
      }
    ],
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        "accessibility": "explicit"
      }
    ],
    "@typescript-eslint/indent": [
     "error",
     2
    ],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": true
        }
      }
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      { "selector": "variable", "format": [ "snake_case", "PascalCase" ] }
    ],
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-for-in-array": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    "@typescript-eslint/no-unnecessary-qualifier": "error",
    "@typescript-eslint/no-unnecessary-type-arguments": "error",
    "@typescript-eslint/no-unused-expressions": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/quotes": [
      "error",
      "single"
    ],
    "@typescript-eslint/semi": [
      "error",
      "always"
    ],
    "@typescript-eslint/type-annotation-spacing": "error",
    "arrow-body-style": "error",
    "brace-style": [
      "error",
      "stroustrup"
    ],
    "comma-dangle": [
      "error",
      {
        "arrays": "always-multiline",
        "exports": "always-multiline",
        "objects": "always-multiline",
      }
    ],
    "constructor-super": "error",
    "eol-last": "error",
    "eqeqeq": [
      "error",
      "smart"
    ],
    "id-blacklist": [
      "error",
      "any",
      "Number",
      "number",
      "String",
      "string",
      "Boolean",
      "boolean",
      "Undefined",
      "undefined"
    ],
    "id-match": "error",
    "import/no-default-export": "error",
    "import/no-extraneous-dependencies": "error",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": false,
        },
      },
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "new-parens": "error",
    "no-duplicate-case": "error",
    "no-duplicate-imports": "error",
    "no-eval": "error",
    "no-extra-bind": "error",
    "no-fallthrough": "error",
    "no-invalid-this": "error",
    "no-irregular-whitespace": "error",
    "no-multiple-empty-lines": "error",
    "no-new-wrappers": "error",
    "no-restricted-syntax": [
      "error",
      "ForInStatement"
    ],
    "no-return-await": "error",
    "no-sequences": "error",
    "no-sparse-arrays": "error",
    "no-throw-literal": "error",
    "no-trailing-spaces": "error",
    "no-undef-init": "error",
    "no-underscore-dangle": "error",
    "no-unsafe-finally": "error",
    "no-var": "error",
    "object-shorthand": [
      "error",
      "never"
    ],
    "one-var": [
      "error",
      "never"
    ],
    "prefer-const": "error",
    "prefer-object-spread": "error",
    "radix": "error",
    "spaced-comment": [
      "error",
      "always",
      {
        "markers": [
          "/"
        ]
      }
    ],
    "unicorn/filename-case": "error",
    "use-isnan": "error",
  }
};
