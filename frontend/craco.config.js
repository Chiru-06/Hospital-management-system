module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add fallback for MUI system
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        '@mui/system': require.resolve('@mui/system'),
      };

      // Add rule for handling MUI modules
      webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      });

      return webpackConfig;
    }
  }
}; 