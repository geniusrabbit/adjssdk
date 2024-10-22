import { CustomRender } from './custom_render.js';
import { EmbeddedAd } from './embedded.js';

const defaultConfig = {
  srcURL: "https://example.com",
  dataParams: {
    slot: "data-ad-slot",
    format: "data-ad-format",
    fullWidth: "data-full-width-responsive",
  },
  on: {
    error: null,
    loading: null,
  },
  render: undefined,
}

export class Manager {
  constructor() {
    this.admappers = [];
  }

  setMapper(matchPattern, conf) {
    const config = { ...defaultConfig, ...conf };
    console.log(">>>>> config", config);;
    this.admappers.push({
      matchPattern,
      config
    });
  }

  execute() {
    for (let it of this.admappers) {
      document.querySelectorAll(it.matchPattern).forEach((el) => {
        let slot = el.getAttribute("data-ad-slot");
        let format = el.getAttribute("data-ad-format");
        let fullWidth = el.getAttribute("data-full-width-responsive");
        let cusomRender = new CustomRender();
        var initedRender = false;

        el.querySelectorAll("script[type='html/template']").forEach((el) => {
          let content = (el.innerHTML + "").trim();
          let ttype = el.getAttribute("data-type");
          if (content && ttype) {
            cusomRender.addTemplate(ttype, content);
            initedRender = true;
          }
        });

        new EmbeddedAd({
          element: el,
          zone_id: slot,
          JSONPLink: it.config.srcURL,
          format: format,
          fullWidth: fullWidth,
          render: initedRender ? cusomRender : it.config.render,
        }).
        on('loading', it.config.on.loading).
        on('error', it.config.on.error).
        render();
      });
    }
  }
}
