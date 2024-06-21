// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  setupFiles: ['<rootDir>/src/polyfill.js'],
  testEnvironment: 'jsdom',
}

// jest.config.js
module.exports = {
  setupFiles: ['./jest.setup.js'],
  // Other configurations...
}
