const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  watch: true,
  devtool: "source-map",
  mode: "development",
  entry: {
    main: "./src/index.js",
    home: "./src/assets/js/home.js",
  },
  output: {
    filename: "assets/js/[name].[hash:7].js",
    path: path.resolve(__dirname, "build"),
  },
  devServer: {
    port: 9000,
    contentBase: path.resolve(__dirname, "build"),
  },

  module: {
    rules: [
      //JS
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      // CSS
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "assets/images/", //to be able to use url images in my styles
            },
          },
          { loader: "css-loader", options: { importLoaders: 1 } },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("autoprefixer")],
              },
            },
          },
        ],
      },

      //SASS
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "assets/images/", //to be able to use url images in my styles
            },
          },
          { loader: "css-loader", options: { importLoaders: 1 } },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("autoprefixer")],
              },
            },
          },
          "sass-loader",
        ],
      },

      //Images, fonts
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash:7].[ext]",
              outputPath: "assets/images/",
              publicPath: "assets/images/",
            },
          },

          //Compress Images
          {
            loader: "image-webpack-loader",
          },
        ],
      },

      {
        test: /\.(woff|woff2|eot|ttf)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assets/fonts/",
              publicPath: "assets/fonts/",
            },
          },
        ],
      },

      // HTML
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      //Pug
      {
        test: /\.pug$/i,
        use: ["html-loader", "pug-html-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/styles/app.css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.pug",
      chunks: ["main", "home"],
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      `...`, //extending `terser-webpack-plugin`
      new CssMinimizerPlugin(),
    ],
  },
};
