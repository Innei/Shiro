module.exports = {
  extends: ['@innei/eslint-config-react-ts'],
  rules: {
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: 'use.*Selector',
        // additionalHooks: 'use(.*?)Selector',
      },
    ],
    'prefer-arrow-callback': 'off',
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
  },
}
