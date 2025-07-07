module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  // Tell Jest to transform axios (and other ESM modules if needed)
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)"
  ],
};