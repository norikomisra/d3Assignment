// Function to get language

lang_dictionary = {};

// Read language data
d3.csv('data/data_lang.txt', function (error, data) {
    _.each(data, function (row) {
        if (!_.has(lang_dictionary, row.country)) {
            lang_dictionary[row.country] = [];            
        }
        if (row.lang != "") {
            lang_dictionary[row.country].push(row.lang);
        }
        
    });
});