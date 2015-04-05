//*********
//Create matrix ready with our own data
//*********

// Create matrix and map
d3.csv('data/data_3000.csv', function (error, data) {
    sortedData = getSortedData(data);
    var mpr = chordMpr(sortedData);

    mpr
    .addValuesToMap('sender')
    .setFilter(function (row, a, b) {
        return (row.sender === a.name && row.receiver === b.name)
    })
    .setAccessor(function (recs, a, b) {
        if (!recs[0]) return 0;
        return +recs[0].value;
    });
    drawChords(mpr.getMatrix(), mpr.getMap());
});


//*********
//Draw the chord diagram
//*********
var svg, rdr, chordPaths;
var removed;
var lang = "";

function drawChords(matrix, mmap){
    rdr = chordRdr(matrix, mmap);
    
    var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(matrix);
        //We may want to sort the chords. In that case, add the following.
        //.sortChords(d3.descending);

    //Define size of the chords
    var width = 900,
        height = 900,
        innerRadius = Math.min(width, height) * .34,
        outerRadius = innerRadius * 1.1;

    //Define color of the chords. We probably should use different colors for each region.
    var fill = d3.scale.ordinal()
        .domain(d3.range(1))
        .range(getColorArray(mmap));

    svg = d3.select("#area-chord").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        //We may want to set a unique selector
        .attr("id", "circle")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("g").selectAll("path")
        .data(chord.groups)
        .enter().append("path")
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", function(d) { return fill(d.index); })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
        .on("mouseover", fade())        
        .on("mouseout", show());

    chordPaths = svg.append("g")
        .attr("class", "chord")
        .selectAll("path")
        .data(chord.chords)
        .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", function(d) { return fill(d.target.index); })
        .style("opacity", 1)
        .on("mouseover", mouseoverChord)
        .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });
        
    var label = svg.selectAll("g.group")
        .data(chord.groups())
        .enter().append("svg:g")
        .attr("class", "group")
        .on("mouseover", mouseoverArc)
        .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });
        
    label.append("svg:text")
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", ".35em")
        .style("font-family", "helvetica, arial, sans-serif")
        .style("font-size", "10px")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (innerRadius + 36) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return rdr(d).gname; });
        
        highlightLanguage();

// end of drawChords
}

// Returns an event handler for fading a given chord group.
function fade() {
    return function(g, i) {
        svg.selectAll(".chord path")
            .filter(function(d) {
                if(isFilteredLanguage(d)) {
                    return true;
                } else {
                    return d.source.index != i && d.target.index != i;
                }            
            })
            .transition()
            .style("opacity", 0.1);
    };
}

// Returns an event handler for unfading a given chord group.
function show() {
    return function(g, i) {
        svg.selectAll(".chord path")
            .transition()
            .style("opacity", 1);
        highlightLanguage();
    };
}

// Filter for language
function isFilteredLanguage(d) {
    if(lang == "") {
        return false;
    }
    slang = lang_dictionary[rdr(d).sname];
    tlang = lang_dictionary[rdr(d).tname];
    if(_.contains(slang, lang) && _.contains(tlang, lang)) {
        return false;
    } else {
        return true;
    }
}

// Highlight specific language
function highlightLanguage() {
    if(lang == "") {
        return;
    }
    svg.selectAll(".chord path")
        .transition()
        .style("opacity", 0.1);
    svg.selectAll("path[language=\"" + lang + "\"]")
        .transition()
        .style("opacity", 1);
}

// Tooltip for arc
function mouseoverArc(d, i) {
    d3.select("#tooltip")
        .style("visibility", "visible")
        .html(groupTip(rdr(d)))
        .style("top", function () { return (d3.event.pageY - 80)+"px"})
        .style("left", function () { return (d3.event.pageX - 130)+"px"});
}

// Tooltip for chord
function mouseoverChord(d, i) {
    d3.select("#tooltip")
        .style("visibility", "visible")
        .html(chordTip(rdr(d)))
        .style("top", function () { return (d3.event.pageY - 80)+"px"})
        .style("left", function () { return (d3.event.pageX - 130)+"px"});
}

function chordTip (d) {
    var p = d3.format(".2%"), q = d3.format(",.3r");
    return d.sname + " to " + d.tname + "<br />"
        + d.svalue;
}

function groupTip (d) {
    var p = d3.format(".1%"), q = d3.format(",.3r");
    return "[" + d.gname + "]" + "<br />"
        + "Total sent: " + q(d.gvalue);
}