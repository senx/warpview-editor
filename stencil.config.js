const sass = require("@stencil/sass");
exports.config = {
  namespace: "quantum-editor",
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
