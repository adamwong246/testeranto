const isProduction = process.env.NODE_ENV == "production";

const config = {
  target: 'node',
  entry: "./index.ts",
  experiments: {
    topLevelAwait: true
  },
  output: {
    filename: 'test.bundle.js',
    libraryTarget: "umd"
  },
  module: {
    unknownContextCritical: false,
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  resolve: {
    extensions: [
      ".ts", ".js", ".mjs"
    ]
  }
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};