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
function listings(userId, callback) {
  var searchOptions = _.assign({}, DEFAULT_listings_PARAMS, {}),
    requestConfigs = _.assign({}, configs.DEFAULT_REQUEST_CONFIGS, {
      url: configs.USER_HOST_URL + '/' + userId
    }),
    listings = [],
    $;
  // Make request to get user listings
  request(requestConfigs, function(err, res, body) {
    if (!err && res.statusCode == 200 && _.isFunction(callback)) {
      try {
        // Since the res is in HTML, parse with cheerio
        $ = cheerio.load(body);

        // Construct list of textual listings
        $('.hostings-list li').each(function(idx, $listing) {
          try {
            listings.push({
              link: $listing.children[1].attribs.href,
              photo: $listing.children[1].children[1].attribs.src,
              title: $listing.children[1].children[1].attribs.title,
              location: $listing.children[1].children[2].next.children[3].children[0].data.trim()
            });
          } catch (err) { /* Ignore that element */ }

        });

        // Invoke success callback
        callback(null, listings);
      } catch (err) {
        if (_.isFunction(callback)) {
          callback(err, res);
        }
      }
    } else if (err && _.isFunction(callback)) {
      callback(err, res);
    }
  });
}

module.exports = listings;
