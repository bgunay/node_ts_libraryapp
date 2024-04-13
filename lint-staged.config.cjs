module.exports = {
    '*.+(ts|js|json)': ['eslint **/*.ts --fix', 'prettier --write'],
    '*.+(ts)': [() => 'tsc -p tsconfig.json --noEmit', () => 'tsc -p tsconfig.spec.json --noEmit'],
};
