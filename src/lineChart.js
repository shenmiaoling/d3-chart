var d3 = require("d3")
require("./styles/lineChart.styl")

var  stationA = require("./data/dataset/0.json")
var  stationB = require("./data/dataset/1.json")
var  stationC = require("./data/dataset/2.json")
class LineChart {
  constructor(dataset,svg){
    this.timeParse = d3.timeParse("%Y-%m-%d")
    this.dates = dataset.map((d) => { return this.timeParse(d.date) })
    this.scaleX = d3.scaleTime().domain([d3.min(this.dates), d3.max(this.dates)]).range([0, 500])
    this.scaleY = d3.scaleLinear().domain([60, 0]).range([0, 500])
    this.data = dataset
    this.svg = svg
    this.lineFunc = d3.line().x((d) => { return this.scaleX(this.timeParse(d.date)) }).y((d) => { return this.scaleY(d.value) }).curve(d3.curveCatmullRom.alpha(0.5))
    this.drawAxis()
    this.drawLine()
    this.drawPoint()
  }
  drawAxis(){
    const axisX = d3.axisBottom(this.scaleX).ticks(d3.timeDay.every(1)).tickFormat(d3.timeFormat("%a"))
    const axisY = d3.axisLeft(this.scaleY)
    this.svg.append('g').call(axisY).attr('class', 'y-axis').attr('transform', 'translate(25, 25)')
    this.svg.append('g').call(axisX).attr("class", 'x-axis').attr('transform', 'translate(25, 525)')
  }
  drawLine(){
    this.svg.append('path').attr('d', this.lineFunc(this.data)).attr('stroke', '#ababad').attr('stroke-width', 2).attr('fill', 'none').attr('transform', 'translate(25, 0)').attr('id', 'dataset-path')
  }
  drawPoint(){
    const tooltip = d3.select("#line-chart").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
    const point = this.svg.selectAll('.point')
    .data(this.data)
    .enter()
    .append('circle')
    .attr('transform', 'translate(25, 0)')
    .attr("cx", (d) => { return this.scaleX(this.timeParse(d.date)) })
    .attr("cy", (d) => { return this.scaleY(d.value) }).attr("r", 5)
    .style("fill","#795548")
    .on("click", function(d) {
      var value ="ddd"
        tooltip.transition()
          .duration(300)
          .style("opacity", 0.85);
      const updateInput=function (){
          localStorage.setItem('value',value)
        }
      const handleBlur = ()=>{
        tooltip.transition()
          .duration(300)
          .style("opacity", 0);
      }
      var input = tooltip.html(`<input value=${value} onchange=${updateInput()} onblur=${handleBlur()}>`+"</input>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .on("change", function(d) {
            value = d3.event.target.value
            console.log(value)
            tooltip.transition()
          .duration(300)
          .style("opacity", 0);
        });
    })
  }
  updateChart(data,date){
    this.svg.selectAll('circle').remove()
    this.dates = data.map((d) => { return this.timeParse(d.date) })
    this.scaleX = d3.scaleTime().domain([d3.min(this.dates), d3.max(this.dates)]).range([0, 500])
    const point = this.svg.selectAll('.point')
    .data(data)
    .enter()
    .append('circle')
    .attr('transform', 'translate(25, 0)')
    .attr("cx", (d) => { return this.scaleX(this.timeParse(d.date)) })
    .attr("cy", (d) => { return this.scaleY(d.value) }).attr("r", 5)
    .style("fill","#795548")

    const axisX = {
      'last_week': d3.axisBottom(this.scaleX).ticks(d3.timeDay.every(1)).tickFormat(d3.timeFormat("%a")),
      'last_month': d3.axisBottom(this.scaleX).ticks(d3.timeWeek.every(1)).tickFormat(d3.timeFormat("%m-%d")),
      'last_year': d3.axisBottom(this.scaleX).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%Y-%m"))
      }
    date == 'last_year'
      ? d3.select('g.x-axis').call(axisX[date]).selectAll('text').style('text-anchor', 'end').attr('transform', 'rotate(-45)')
      : d3.select('g.x-axis').call(axisX[date])
    d3.select('#dataset-path').transition().duration(250).attr('d', this.lineFunc(data.map((d) => {
      return { date: d.date, value: 0 }
    }))).transition().duration(750)
    .ease(d3.easeBounceOut).attr('d', this.lineFunc(data))
    point.transition().duration(250)
    .attr("cx", (d) => { return this.scaleX(this.timeParse(d.date)) })
    .attr("cy", (d) => { return 500 }).attr("r", 5)
    .style("fill","#795548")
    .transition().duration(750)
    .ease(d3.easeBounceOut)
    .attr("cx", (d) => { return this.scaleX(this.timeParse(d.date)) })
    .attr("cy", (d) => { return this.scaleY(d.value) })
  }
}
let date = 'last_week'
let math = 'avg'
let data = {}
const svg = d3.select('#line-chart').append('svg').attr('width', 560).attr('height', 560)
  data = stationA
  const lineChart = new LineChart(data.last_week.map((d) => { return { date: d.date, value: d.avg } }),svg)

d3.select('select#date-options').on('change', () => {
  date = d3.select('select#date-options').property('value')
  lineChart.updateChart(data[date].map((d) => { return { date: d.date, value: d[math] } }),date)
})

d3.select('select#data-options').on('change', () => {
  const value = d3.select('select#data-options').property('value')
    data = require(`./data/dataset/${value}.json`)
    lineChart.updateChart(data[date].map((d) => { return { date: d.date, value: d[math] } }),date)
})

d3.select('select#math-options').on('change', () => {
  math = d3.select('select#math-options').property('value')
  lineChart.updateChart(data[date].map((d) => { return { date: d.date, value: d[math] } }),date)
})
