module.exports = {
	env: {
		es6: true,
		node: true,
		jest: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
		'prettier/react',
	],
	parserOptions: {
		project: './tsconfig.json',
	},
	plugins: [
		'react',
		'react-hooks',
		'@typescript-eslint',
		'prettier',
		'prettier/react',
	],
	rules: {
		indent: ['error', 4, { SwitchCase: 1 }],
		quotes: ['error', 'single', { avoidEscape: true }],
		'no-empty-function': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'react/display-name': 'off',
		'react/prop-types': 'off',
		'prettier/prettier': 'error',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
