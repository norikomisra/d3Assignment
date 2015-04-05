// Function to sort data by region

region_order =[ "Northern America", "Central America", "South America", "Caribbean", "Western Europe", "Southern Europe", "Northern Europe", "Eastern Europe", "Australia and New Zealand", "Eastern Asia", "South-Eastern Asia", "Southern Asia", "Central Asia", "Western Asia", "Northern Africa", "Western Africa", "Eastern Africa", "Middle Africa", "Southern Africa"]
country_order =[]

// Read regional data and sort
d3.csv('data/data_region.txt', function (error, data) {
    _.each(data, function (row) {
        row[ "order"] = _.indexOf(region_order, row.region);
    });
    data = _.sortBy(data, "order");
    _.each(data, function (row) {
        country_order.push(row.country);
        //console.log(row.country + ", " + row.region + ", " + row.order);
    });
});

var missing = [];

// Return array of pairs sorted by regions
function getSortedData(data) {
    _.each(data, function (pair) {
        var s = _.indexOf(country_order, pair.sender);
        var r = _.indexOf(country_order, pair.receiver);
        if (s == -1 || r == -1) {
            pair["order"] = 999999;
            if (s == -1) {
                console.log(pair.sender);
            }
            if (r == -1) {
                console.log(pair.receiver);
            }
        } else {
           pair["order"] = s * 1000 + r; 
        }        
    });
    data = _.sortBy(data, "order");
    return data;
}