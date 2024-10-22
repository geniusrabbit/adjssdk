import { renderTemplate as rt } from './libs/template.js';
import { prepareURL } from './libs/urlutils.js';
import { Render, assertByName } from './render.js';

export class CustomRender {
  constructor() {
    this._templates = [];
    this._r = new Render();
  }

  addTemplate(name, template) {
    this._templates.push({
      name,
      template
    });
  }

  getTemplateByName(name) {
    for (let it of this._templates) {
      if (it.name === name) {
        return it.template;
      }
    }
    return null;
  }

  renderTemplate(name, data) {
    let tmpl = this.getTemplateByName(name);
    if (!tmpl) {
      return "";
    }
    let newData = {...data, ...{
      url: data.url ? prepareURL(data.url) : undefined,
      content_url: data.content_url ? prepareURL(data.content_url) : undefined,
      mainAsset: assertByName('main', data.assets),
    }};
    if (newData.fields && newData.fields.url) {
      newData.fields.url = prepareURL(newData.fields.url);
    }
    return rt(tmpl, newData);
  }

  proxy(data, target) {
    let tmpl = this.renderTemplate('proxy', data);
    if (!tmpl) {
      this._r.proxy(data, target);
    } else {
      this._r.html(tmpl, target);
    }
  }

  native(data, target) {
    let tmpl = this.renderTemplate('native', data);
    if (!tmpl) {
      this._r.native(data, target);
    } else {
      this._r.html(tmpl, target);
    }
  }

  banner(data, target) {
    let tmpl = this.renderTemplate('banner', data);
    if (!tmpl) {
      this._r.banner(data, target);
    } else {
      this._r.html(tmpl, target);
    }
  }

  html(html, target) {
    this._r.html(html, target);
  }
}