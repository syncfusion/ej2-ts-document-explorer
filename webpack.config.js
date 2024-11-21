var glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    index: glob.sync("./src/**/*.ts")
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                //If utilize the syncfusion sass files, then use the following line
                includePaths: ["node_modules/@syncfusion"],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      favicon: "favicon.ico"
    }),
    new HtmlWebpackPlugin({
      filename: "layout.html",
      template: "./src/layout/layout.html",
    }),
    new HtmlWebpackPlugin({
      filename: "imageEditor.html",
      template: "./src/image/imageEditor.html",
    }),
    new HtmlWebpackPlugin({
      filename: "pdfviewer.html",
      template: "./src/pdfviewer/pdfviewer.html",
    }),
    new HtmlWebpackPlugin({
      filename: "docEditor.html",
      template: "./src/docEditor/docEditor.html",
    }),
    new HtmlWebpackPlugin({
      filename: "excel.html",
      template: "./src/excel/excel.html",
    }),
    new HtmlWebpackPlugin({
      filename: "aboutPage.html",
      template: "./src/about/aboutPage.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
        extractComments: false,
    })],
  },
};
