var d3 = require("d3")
require("./styles/depandencyChart.styl")
var data = require('./data/dependenceData')
import _ from "underscore"
class ForceChart {
  constructor(options){
    this.svg = options.svg
    this.width = options.width
    this.height = options.height
    this.dragChart()
  }
  dragChart(){
    //定义颜色范围
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    //定义力模拟器
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        // .force("linkDistance",150)
        .force("center", d3.forceCenter(this.width / 2, this.height / 2));

    var link = this.svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
    var node = this.svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", function(d){return d.rad;})
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(data.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(data.links);
    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    //   linkText
    // .attr("x", function(d) { return (d.source.x + (d.target.x - d.source.x) * 0.5); })
    // .attr("y", function(d) { return (d.source.y + (d.target.y - d.source.y) * 0.5);
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(1).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
}
var width = 600,
height = 600
var svg = d3.select(".dependence-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
const dragchart = new ForceChart({svg:svg, width:width, height:height})
