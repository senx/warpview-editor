import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
export const config: Config = {
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
      serviceWorker: null
    }
  ]
};
