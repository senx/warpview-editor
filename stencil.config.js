const sass = require("@stencil/sass");
exports.config = {
  namespace: "warp-view-editor",
  plugins: [sass()],
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
