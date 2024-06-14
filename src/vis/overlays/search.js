var _ = require('underscore');
/**
 * zzj updated 2024.6.14
 * 使用公司提供的接口，参考https://github.com/pelias/leaflet-plugin的样式和交互设计，开发的地名搜索控件
 * 待改进：暂未实现i18n，暂未将接口地址进行配置化
 */
var Search = require('../../geo/ui/search/search2');
var Template = require('../../core/template');

var SearchOverlay = function (data, opts) {
  if (!opts.mapView) throw new Error('mapView is required');
  if (!opts.mapModel) throw new Error('mapModel is required');

  var options = _.extend(data, {
    mapView: opts.mapView,
    model: opts.mapModel
  });

  if (data.template) {
    options.template = Template.compile(data.template, data.templateType || 'mustache');
  }

  var overlay = new Search(options);
  return overlay.render();
};

module.exports = SearchOverlay;
