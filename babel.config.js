module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      '@babel/preset-react', // Add this line to enable JSX transformation
    ],
    plugins: [
      // Your existing plugins here
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
    ],
  };
};
