// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add the fallback for Node.js core modules
config.resolver.extraNodeModules = {
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer/'),
};

// Optionally, alias for any other custom resolution
config.resolver.alias = {
  crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
  stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
  buffer: path.resolve(__dirname, 'node_modules/buffer/'),
};

module.exports = config;
