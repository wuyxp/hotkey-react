module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
		jest: true
	},
	extends: [
		'react-app',
		'react-app/jest'
		// 'eslint:recommended',
		// 'plugin:@typescript-eslint/recommended',
		// 'prettier',
		// 'plugin:prettier/recommended'
	],
	// parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': 'error',
		'no-case-declarations': 'off',
		'no-constant-condition': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'no-unused-vars': 'off'
	}
};
