module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.[t|j]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  transformIgnorePatterns: [
    "/node_modules/(?!axios)"
  ],
};