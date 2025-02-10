import nx from '@nx/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/node_modules', '**/test-setup.ts', '**/.*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    // Override or add rules here
    rules: {},
  },
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['src/**/*.ts'],
    ignores: ['**/index.ts', '**/*spec.ts', '**/environment.ts', '**/environment.*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.app.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          ignoredMethodNames: [
            'ngOnInit',
            'constructor',
            'ngOnChanges',
            'transform',
            'ngAfterViewInit',
            'ngAfterViewChecked',
            'ngAfterContentInit',
            'ngAfterContentChecked',
          ],
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variableLike',
          format: ['camelCase', 'UPPER_CASE', 'snake_case'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          types: ['function'],
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'show', 'hide', 'keep', 'auto'],
          filter: {
            regex:
              '^(standalone|eventCoalescing|reRenderOnLangChange|prodMode|filterMultiple|byDefault|disabled|static|grid|flex|required|initialValue|onlySelf|emitEvent|success|error|hidden|value|checked|status|nonNullable)$',
            match: false,
          },
        },
        {
          selector: 'property',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'show', 'hide', 'keep', 'auto'],
          filter: {
            regex:
              'pd[A-Za-z]+[A-Za-z]*|standalone|eventCoalescing|reRenderOnLangChange|prodMode|multi|writable|filterMultiple|byDefault|compare|disabled|static|grid|flex|required|initialValue|onlySelf|emitEvent|success|error|hidden|value|checked|status|nonNullable',
            match: false,
          },
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          types: ['boolean', 'string', 'number', 'array'],
          modifiers: ['exported'],
          format: ['UPPER_CASE'],
        },
        {
          selector: ['enumMember'],
          format: ['UPPER_CASE'],
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
          custom: {
            regex: '^E[A-Z]',
            match: true,
          },
        },
      ],

      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/label-has-associated-control': 'off',
      '@angular-eslint/component-class-suffix': [
        'error',
        {
          suffixes: ['Page', 'Component', 'Dialog', 'Widget'],
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'pd',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'pd',
          style: 'kebab-case',
        },
      ],
    },
  },
];
