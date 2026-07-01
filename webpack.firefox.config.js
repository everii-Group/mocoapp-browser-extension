const { v4: uuidv4 } = require("uuid")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const { compact } = require("lodash/fp")
const isEmpty = require("lodash/isEmpty")

const baseConfig = require("./webpack.base.config")

const appliationId = process.env.APPLICATION_ID

module.exports = (env) => {
  if (process.env.NODE_ENV === "production" && isEmpty(appliationId)) {
    throw new Error("APPLICATION_ID is not set, set it in .env or as an environment variable")
  }

  const config = baseConfig(env)

  config.plugins.unshift(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/manifest.firefox.json",
          to: "manifest.json",
          transform: function (content, _path) {
            const manifest = JSON.parse(
              content.toString().replace(/\[version\]/g, process.env.npm_package_version),
            )
            return Buffer.from(
              JSON.stringify({
                ...manifest,
                permissions: compact([
                  ...manifest.permissions,
                  process.env.NODE_ENV === "development" && process.env.USE_LOCAL_MOCO === "true"
                    ? "http://*.mocoapp.localhost/*"
                    : null,
                ]),
                browser_specific_settings: {
                  gecko: {
                    id: appliationId || `{${uuidv4()}}`,
                  },
                },
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
              }),
            )
          },
        },
      ],
    }),
  )

  return config
}
