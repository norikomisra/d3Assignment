// Original codes to get language

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

// Returns languages of a chord by string
function getLanguages(d) {
    var s = rdr(d).sname;
    var t = rdr(d).tname;
    var lang = _.intersection(lang_dictionary[s], lang_dictionary[t]);
    //
    var result = "";
    _.each(lang, function (e) {
        result += e + " ";
    });
    result = result.trim();
    return result;
}