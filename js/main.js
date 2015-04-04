//*********
//Create matrix ready with our own data
//*********

// Create matrix and map
d3.csv('data/data_3000.csv', function (error, data) {
    var mpr = chordMpr(data);

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

function drawChords(matrix, mmap){
    var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(matrix);
        //We may want to sort the chords. In that case, add the following.
        //.sortChords(d3.descending);

    //Define size of the chords
    var width = 900,
        height = 750,
        innerRadius = Math.min(width, height) * .41,
        outerRadius = innerRadius * 1.1;

    //Define color of the chords. We probably should use different colors for each region.
    var fill = d3.scale.ordinal()
        .domain(d3.range(1))
        .range(["#666666"]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        
    //We may want to set a unique selector 
    //.attr("id", "circle")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("g").selectAll("path")
        .data(chord.groups)
        .enter().append("path")
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", function(d) { return fill(d.index); })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
        .on("mouseover", fade(.1))
        .on("mouseout", fade(1));

    var ticks = svg.append("g").selectAll("g")
        .data(chord.groups)
        .enter().append("g").selectAll("g")
        .data(groupTicks)
        .enter().append("g")
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
              + "translate(" + outerRadius + ",0)";
        });

//I don't think we need to draw lines around the circle, so we can remove the following, maybe?
// ticks.append("line")
//     .attr("x1", 1)
//     .attr("y1", 0)
//     .attr("x2", 5)
//     .attr("y2", 0)
//     .style("stroke", "#000");

    ticks.append("text")
        .attr("x", 8)
        .attr("dy", ".35em")
        .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
        .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        //Add some more styling
        .style("font-family", "helvetica, arial, sans-serif")
        .style("font-size", "9px")
        //We need to pass country names to the labels
        .text(function(d) { return d.label; });

    svg.append("g")
        .attr("class", "chord")
        .selectAll("path")
        .data(chord.chords)
        .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", function(d) { return fill(d.target.index); })
        .style("opacity", 1);

// end of drawChords
}

// Returns an array of tick angles and labels, given a group.
function groupTicks(d) {
  var k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, 1000).map(function(v, i) {
    return {
      angle: v * k + d.startAngle,
      label: i % 5 ? null : v / 1000 + "k"
    };
  });
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
//}