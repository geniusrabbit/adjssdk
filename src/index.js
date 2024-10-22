import { EmbeddedAd } from './embedded.js';

import { Manager } from './manager.js';

function amgConfigure(customInit) {
  let mn = new Manager();
  if (!!customInit) {
    customInit(mn);
  } else {
    mn.setMapper('[data-ad-slot]', {});
  }
  mn.execute();
}

export default { EmbeddedAd, Manager, amgConfigure };