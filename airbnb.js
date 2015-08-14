var api = require('./api'),
    models = require('./models');

module.exports = {
  search: api.search,
  info: api.info,
  reviews: api.reviews,
  listings : api.listings,
  income: api.income,
  availability: api.availability,
  Hosting: models.Hosting
};
