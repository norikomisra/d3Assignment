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
        .on("mouseover", fade(.1))
        .on("mouseout", fade(1));

    chordPaths = svg.append("g")
        .attr("class", "chord")
        .selectAll("path")
        .data(chord.chords)
        .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius))
        .attr("language", chordLanguage)
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

// end of drawChords
}

// Returns an event handler for fading a given chord group.
function fade(opacity) {
  return function(g, i) {
    svg.selectAll(".chord path")
        .filter(function(d) { return d.source.index != i && d.target.index != i; })
      .transition()
        .style("opacity", opacity);
  };
}

// Add language information to chords
function chordLanguage(d) {
    return rdr(d).sname + " " + rdr(d).tname;
}

// Tooltip for arc
function mouseoverArc(d, i) {
    d3.select("#tooltip")
        .style("visibility", "visible")
        .html(groupTip(rdr(d)))
        .style("top", function () { return (d3.event.pageY - 80)+"px"})
        .style("left", function () { return (d3.event.pageX - 130)+"px"});

    chordPaths.classed("fade", function(p) {
        return p.source.index != i && p.target.index != i;
    });
}

// Tooltip for chord
function mouseoverChord(d, i) {
    d3.select("#tooltip")
        .style("visibility", "visible")
        .html(chordTip(rdr(d)))
        .style("top", function () { return (d3.event.pageY - 80)+"px"})
        .style("left", function () { return (d3.event.pageX - 130)+"px"});

    chordPaths.classed("fade", function(p) {
        return p.source.index != i && p.target.index != i;
    });
}

function chordTip (d) {
    var p = d3.format(".2%"), q = d3.format(",.3r");
    return d.sname + " to " + d.tname + "<br />"
        + d.svalue;
}

function groupTip (d) {
    var p = d3.format(".1%"), q = d3.format(",.3r");
    return d.gname + " : " + q(d.gvalue);
}