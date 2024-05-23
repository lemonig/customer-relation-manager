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
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
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
      console.log("环境：", env, paths);

      if (isPro(env)) {
        webpackConfig.mode = "production";
        // webpackConfig.devtool = "nosources-source-map";
        webpackConfig.devtool = false;
        // webpackConfig.output = {
        //   ...webpackConfig.output,
        //   path: path.resolve(__dirname, "dist"),
        //   publicPath: "/ ",
        // };

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
          splitChunks: {
            ...webpackConfig.optimization.splitChunks,

            chunks: "async",
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 4,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
              defaultVendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                reuseExistingChunk: true,
              },
              base: {
                // 基本框架
                chunks: "all",
                test: /(react|react-dom|react-dom-router)/,
                name: "base",
                priority: 100,
              },

              echarts: {
                test: /(echarts)/,
                name: "echarts",
                priority: 100,
              },

              default: {
                minChunks: 2,
                priority: -20,
                // 当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
                reuseExistingChunk: true,
              },
            },
          },
        };
      }

      webpackConfig.externals = {};
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
    plugins: [
      ...whenProd(
        () => [
          new webpackBundleAnalyzer(),
          new MomentLocalesPlugin({
            localesToKeep: ["zh-cn"],
          }),
          new compressionWebpackPlugin({
            test: /\.js$|\.html$|\.css$/u,
            threshold: 8192, // 超过 4kb 压缩
          }),
        ],
        []
      ),
    ],
    babel: {
      presets: [],
      plugins: [
        // AntDesign 按需加载
        [
          "import",
          {
            libraryName: "antd",
            libraryDirectory: "es",
            style: true,
          },
          "antd",
        ],
        [
          "@babel/plugin-proposal-decorators",
          {
            legacy: true,
          },
        ], // 用来支持装饰器
      ],
      loaderOptions: (babelLoaderOptions, { env, paths }) => {
        return babelLoaderOptions;
      },
    },
  },
};
