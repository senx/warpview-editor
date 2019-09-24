
const sass = require("@stencil/sass");
exports.config = {
  namespace: "warpview-editor",
  plugins: [sass()],
  copy: [
    { src: 'indexdoc.html' }
  ],
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
