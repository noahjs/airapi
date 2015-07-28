var request = require('request'),
  _ = require('lodash'),
  secrets = require('../_secrets'),
  cheerio = require('cheerio'),
  configs = require('../configs'),
  serialize = require('../helpers/serialize'),
  DEFAULT_listings_PARAMS = _.assign({}, configs.DEFAULT_REQUEST_PARAMS, {
    page: 1,
    role: 'host'
  });

/**
 * Get a list of textual listings for a given user, as a host or a guest
 * @param  {Number, String} user - User ID
 * @param  {Object} options - Options to specify page and role of listings
 * @param  {Function} successCallback
 * @param  {Function} failureCallback
 * @return {Void} - List of listings is passed onto callbacks
 *
 * options = {
 *   page: {Number}, default 1
 *   role: {String}, Either 'guest' or 'host', default to 'host'
 * }
 */
function listings(userId, options, successCallback, failureCallback) {
  var searchOptions = _.assign({}, DEFAULT_listings_PARAMS, options),
    requestConfigs = _.assign({}, configs.DEFAULT_REQUEST_CONFIGS, {
      url: configs.USER_HOST_URL + '/' + userId + '?' + serialize(searchOptions)
    }),
    listings = [],
    $;

  // Make request to get user listings
  request(requestConfigs, function(err, res, body) {
    if (!err && res.statusCode == 200 && _.isFunction(successCallback)) {
      try {
        // Since the res is in HTML, parse with cheerio
        $ = cheerio.load(JSON.parse(body).review_content);

        // Construct list of textual listings
        $('.hostings-list .list-layout li').each(function(idx, $review) {
          listings.push({
            link: $review.find('a').attr('herf'),
            photo: $review.find('img').attr('src'),
            title: $review.find('img').attr('title'),
            location: $review.find('.text-normal').text(),
          });
        });

        // Invoke success callback
        successCallback(listings);
      } catch (err) {
        if (_.isFunction(failureCallback)) {
          failureCallback(err, res);
        }
      }
    } else if (err && _.isFunction(failureCallback)) {
      failureCallback(err, res);
    }
  });
}

module.exports = listings;
