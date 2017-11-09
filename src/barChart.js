import * as d3 from 'd3';
require("./styles/barChart.styl")
var data = require('./data/barChart.tsv')
var width = 420,
    barHeight = 20;

var x = d3.scaleLinear()
    .range([0, width]);

var chart = d3.select(".chart")
    .attr("width", width);

d3.tsv("./data/barChart.tsv", function(error, data){
  // console.log(data);
})

data.map( (item,index) => {
console.log(item["name value"] );
  x.domain([0, d3.max(data, function(d) { return d.value; })]);

  chart.attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", function(item) { return x(item.value); })
      .attr("height", barHeight - 1);

  bar.append("text")
      .attr("x", function(d) { return x(d.value) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(data) { return data.value; });
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}
