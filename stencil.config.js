
const sass = require("@stencil/sass");
exports.config = {
  namespace: "warpview-editor",
  plugins: [sass()],
  enableCache: false,
  outputTargets: [
    {
      type: "dist"
    },
    {
      type: "www",
      serviceWorker: false
    }
  ]
};
