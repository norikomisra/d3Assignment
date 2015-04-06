// Original codes to sort data by region and assign colors

region_order = ["Northern America", "Central America", "South America", "Caribbean", "Western Europe", "Northern Europe", "Southern Europe", "Eastern Europe", "Australia and New Zealand", "Eastern Asia", "South-Eastern Asia", "Southern Asia", "Central Asia", "Western Asia", "Northern Africa", "Western Africa", "Eastern Africa", "Middle Africa", "Southern Africa"];
country_order = [];
color_list = {};
region_dictionary = {}; // Dictionary to look up regions

// Read color data
d3.csv('data/color_list.txt', function (error, data) {
    _.each(data, function (row) {
        color_list[row.region] = row.color;
    });
});

// Read regional data and sort
d3.csv('data/data_region.txt', function (error, data) {
    _.each(data, function (row) {
        region_dictionary[row.country] = row.region;
        row["order"] = _.indexOf(region_order, row.region);
    });
    data = _.sortBy(data, "order");
    _.each(data, function (row) {
        country_order.push(row.country);
    });
});

// Return array of pairs sorted by regions
function getSortedData(data) {
    _.each(data, function (pair) {
        var s = _.indexOf(country_order, pair.sender);
        var r = _.indexOf(country_order, pair.receiver);
        if (s == -1 || r == -1) {
            pair["order"] = 999999;
        } else {
           pair["order"] = s * 1000 + r; 
        }        
    });
    data = _.sortBy(data, "order");
    return data;
}

// Function to get array of colors
function getColorArray(mmap) {
    colors = [];
    _.each(mmap, function (country) {
        region = region_dictionary[country.name];
        colors[country.id] = color_list[region];
    });
    return colors;
}