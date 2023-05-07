// const CracoLessPlugin = require("craco-less");
module.exports = {
  // plugins: [
  //   {
  //     plugin: CracoLessPlugin,
  //     options: {
  //       lessLoaderOptions: {
  //         lessOptions: {
  //           modifyVars: { "@primary-color": "#512da8" },
  //           javascriptEnabled: true,
  //         },
  //       },
  //     },
  //   },
  // ],
  webpack: {
    configure: {
      resolve: {
        fallback: {
          // Webpack 5, used in react-script v5, dropped support for built in node polyfills.
          // CRACO is being used to add these polyfills back into the webpack config until they are not needed.
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          zlib: require.resolve("browserify-zlib"),
          url: require.resolve("url"),
          fs: false,
        },
      },
    },
  },
};
