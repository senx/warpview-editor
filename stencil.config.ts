import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: "warpview-editor",
  plugins: [
    sass()
  ],
  enableCache: true,
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
