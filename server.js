var airbnb = require('./airbnb');

var hostId = 121959;
var listingId = 1484030;


console.log('Checking host: ' + hostId);
airbnb.listings(hostId, function(err, listings) {
    if( err )
        return console.log(err);
    console.log(JSON.stringify(listings, null, 4));
});


// airbnb.info(listingId, function(info) {
//   console.log(info);
// });

// airbnb.availability(listingId, {
//  currency: 'USD',
//  month: 1,
//  year: 2015,
//  count: 2
// }, function(availability) {
//   console.log(airbnb.income(availability));
// });