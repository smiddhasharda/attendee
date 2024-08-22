const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add the fallback for Node.js core modules
  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
  };

  // Include the polyfills in the config
  config.resolve.alias = {
    ...config.resolve.alias,
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    buffer: require.resolve('buffer/'),
  };

  // Set the publicPath for correct asset loading
  config.output.publicPath = '/attendee/';

  return config;
};