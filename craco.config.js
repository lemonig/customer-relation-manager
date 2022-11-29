const {
  when,
  whenDev,
  whenProd,
  whenTest,
  ESLINT_MODES,
  POSTCSS_MODES,
} = require("@craco/craco");
const webpack = require("webpack");
const CracoLessPlugin = require("craco-less");
const webpackBundleAnalyzer =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const compressionWebpackPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

const isPro = (dev) => dev === "production";
const pathResolve = (pathUrl) => path.join(__dirname, pathUrl);
const antdTheme = require("./src/styles/antdThem.json");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // 主题色配置
            //https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
            modifyVars: antdTheme,
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      if (isPro(env)) {
        webpackConfig.mode = "production";
        webpackConfig.devtool = "source-map";

        webpackConfig.optimization = {
          flagIncludedChunks: true,
          usedExports: true,
          mergeDuplicateChunks: true,
          concatenateModules: true,
          minimize: true,
          minimizer: [
            //webpack v5 自带最新的
            new TerserPlugin({
              parallel: true, // 可省略，默认开启并行
              terserOptions: {
                toplevel: true, // 最高级别，删除无用代码
                ie8: true,
                safari10: true,
              },
            }),
          ],
        };
      }

      webpackConfig.externals = {};
      console.log("环境：", env, paths);
      return webpackConfig;
    },
    alias: {
      "@Components": pathResolve("src/apps/components"),
      "@Shared": pathResolve("src/apps/shared"),
      "@": pathResolve("src"),
      "@Pages": pathResolve("src/apps/pages"),
      "@Utils": pathResolve("src/apps/utils"),
      "@Store": pathResolve("src/store"),
      "@Styles": pathResolve("src/styles"),
      "@App": pathResolve("src/apps"),
      "@Server": pathResolve("src/apps/server"),
      "@Api": pathResolve("src/apps/api"),
    },
  },
};
