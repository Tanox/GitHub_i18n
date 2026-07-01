/**
 * ESLint 配置文件
 * @file eslint.config.js
 * @description 项目代码规范配置
 * @note 格式化相关规则由 Prettier 处理，ESLint 专注于代码质量和逻辑问题
 */

import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        GM_info: 'readonly',
        GM_xmlhttpRequest: 'readonly',
        GM_setValue: 'readonly',
        GM_getValue: 'readonly',
        GM_addStyle: 'readonly',
        GM_registerMenuCommand: 'readonly',
        unsafeWindow: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': ['warn', { allow: ['error', 'warn', 'log'] }],
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',

      // 禁用与 Prettier 冲突的格式化规则
      'indent': 'off',
      'quotes': 'off',
      'semi': 'off',
      'comma-dangle': 'off',
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      'space-before-function-paren': 'off',
      'keyword-spacing': 'off',
      'space-infix-ops': 'off',
      'eol-last': 'off',
      'no-trailing-spaces': 'off',

      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'multi-line'],
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',
      'no-return-await': 'error',
      'require-await': 'off',

      'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
      'max-params': ['warn', 4],
      complexity: ['warn', 20],

      'no-prototype-builtins': 'error',
      'no-control-regex': 'error',
    },
  },
  {
    files: ['build.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'off',
    },
  },
  {
    files: ['build.js', 'utils/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: ['build/**', 'dist/**', 'node_modules/**', 'coverage/**', 'docs/**'],
  },
];
