var _ = require('underscore');
var Rule = require('./rule');

var VALID_PROPS = ['line-color', 'marker-fill', 'polygon-fill', 'marker-file'];
var VALID_MAPPINGS = ['='];
var MAPPING_STYLE = {
  'polygon-fill': 'polygon-fill',
  'line-color': 'line-color'
}

var isEveryBucketValid = function (rule) {
  var buckets = rule.getBucketsWithCategoryFilter();
  return _.every(buckets, function (bucket) {
    return bucket.filter.name != null && bucket.value != null;
  });
};

var generateCategories = function (bucketsColor, bucketsIcon, prop) {
  return _.map(bucketsColor, function (bucketColor) {
    var bucketIcon = _.find(bucketsIcon, function (bucket) {
      return bucket.filter.name === bucketColor.filter.name;
    });
    var icon = ''
    if (prop == 'line-color') {
      icon = _lineColorLink(bucketColor.value)
    } else {
      icon = (bucketIcon && bucketIcon.value) ? _extractURL(bucketIcon.value) : ''
    }
    return {
      title: bucketColor.filter.name,
      icon: icon,
      color: bucketColor.value,
      style: MAPPING_STYLE[prop]
    };
  });
};

var _lineColorLink = function (color) {
  return "/image_proxy/svg_line.svg?color=" + encodeURIComponent(color)
}

var _extractURL = function (str) {
  var url = '';
  var pattern = /(http|https):\/\/\S+\.(?:gif|jpeg|jpg|png|webp|svg)/g;
  var match = str.match(pattern);
  if (match) {
    url = match[0];
  }
  return url;
};

module.exports = {
  canAdapt: function (rule) {
    rule = new Rule(rule);
    return rule.matchesAnyProperty(VALID_PROPS) &&
      rule.matchesAnyMapping(VALID_MAPPINGS) &&
      isEveryBucketValid(rule);
  },

  adapt: function (rules) {
    var ruleColor = new Rule(rules[0]);
    var ruleIcon = new Rule(rules[1]);
    var prop = ruleColor.getProperty();

    var categoryBucketsColor = ruleColor.getBucketsWithCategoryFilter();
    var categoryBucketsIcon = ruleIcon.getBucketsWithCategoryFilter();
    var defaultBucketsColor = ruleColor.getBucketsWithDefaultFilter();
    var defaultBucketsIcon = ruleIcon.getBucketsWithDefaultFilter();

    var icon = ''
    if (prop == 'line-color') {
      icon = _lineColorLink(defaultBucketsColor[0].value)
    } else {
      icon = _.isEmpty(defaultBucketsIcon) ? '' : _extractURL(defaultBucketsIcon[0].value)
    }

    return {
      categories: generateCategories(categoryBucketsColor, categoryBucketsIcon, prop),
      default: {
        icon: icon,
        color: _.isEmpty(defaultBucketsColor) ? '' : defaultBucketsColor[0].value,
        style: MAPPING_STYLE[prop]
      }
    };
  }
};
