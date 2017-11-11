var d3 = require("d3")
require("./styles//pieChart.styl")
var dataset = require('./data/pieChartData/data.csv')
class PieChart {
  constructor(options){
    this.main = options.main
    this.data = options.data
    this.timeParse = d3.timeParse("%m")
    this.dates = options.data.map((data) => { return this.timeParse(data.Date) })
    this.xScale = d3.scaleTime().domain([d3.min(this.dates), d3.max(this.dates)]).range([0, 450]);
    this.xAxis = d3.axisBottom()
            .scale(this.xScale)
            .tickFormat(d3.timeFormat("%m"+"月"))
    this.drawAxis()
    this.drawSector()
  }
  drawAxis(){
    this.main.append('g')
        .attr('class', 'pie-axisX')
        .attr('transform', 'translate(0,' + (width - padding.left - padding.right) + ')')
        .call(this.xAxis)
        .style("fill","none")
        .selectAll(".tick text")
        .style("text-anchor", "start")
        .attr("x", 16)
        .attr("y", 10);
    this.main.append("text")
        .text("日期")
        .attr("x", this.xScale(this.xScale.ticks().pop())+padding.left)
        .attr("y", height-padding.bottom-padding.top/2)
        .style("fill","white")
        .style("stroke","none")
        .style("font-size","12px");
    titles.map((d,i)=>{
      this.main.append("text")
        .text(d)
        .attr("x",width/1.37)
        .attr("y", i*15+10)
        .style("fill","white")
        .style("fill","white")
        .style("stroke","none")
        .style("font-size","10px")
      colors.map((d,i)=>{
        var rect = this.main.append('rect')
          .attr("x", width/1.5)
          .attr("y",i*15)
          .attr("width",35)
          .attr("height",10)
          .style("fill",d)
        })
    })
  }
  drawSector(){
    this.data.map((d, i)=>{
      var pi = Math.PI;
      var startAngle = 0
      var endAngle = d[users[0]] * (pi/180)*0.9
      for(var i=0;i<4;i++){
        var arc = d3.arc()
                    .innerRadius(this.xScale(this.timeParse(d.Date)))
                    .outerRadius(this.xScale(this.timeParse(Number(d.Date)+1)))
                    .startAngle(startAngle)
                    .endAngle(endAngle)
        startAngle = Number(startAngle)+Number(d[users[i]] * (pi/180)*0.9)
        endAngle = Number(endAngle)+Number(d[users[i+1]]) * (pi/180)*0.9
        var circle = svg.append("path")
                        .attr("d", arc())
                        .attr("transform", 'translate('+padding.bottom + "," + (height - padding.top) + ')')
                        .attr("fill",(d)=>{ return colors[i]})
                        .style("stroke","white")
                        .attr("class","pie-path")
        arc = svg.append("text")
                .text(d[users[i]]+"%")
                .attr("transform", 'translate(' + padding.bottom + "," + (height - padding.top) + ')')
                .attr("transform", function(d) {
                  var c = arc.centroid(d);
                  return "translate(" + (40+c[0]) +"," + (height+c[1]-padding.bottom) + ")";
                  })
                .style("fill","white")
                .style("stroke","none")
                .style("font-size","12px")
                .attr("class","pie-text")
      }
      var arc2 = d3.arc()
          .innerRadius( this.xScale(this.timeParse(d.Date)))
          .outerRadius(this.xScale(this.timeParse(Number(d.Date)+1)))
          .startAngle(0)
          .endAngle(180 * (2*pi/180))
      var circle2 = svg.append("path")
          .attr("d", arc2())
          .attr("transform", 'translate('+padding.bottom + "," + (height - padding.top) + ')')
          .attr("fill", "none")
          .attr("class","dash-circle")
          .attr("stroke","white")
          .style("stroke-dasharray", "2,4")
    })
  }
  updatePie(date){
    svg.selectAll('.pie-path').remove()
    svg.selectAll('.pie-text').remove()
    svg.selectAll('g .pie-axisX').remove()
    svg.selectAll('.dash-circle').remove()
    const timeParse = d3.timeParse("%m")
    const dates = date.map((d) => { return timeParse(d.Date) })
    var xScale = d3.scaleTime().domain([d3.min(dates), d3.max(dates)]).range([0, 400]);
    var xAxis = d3.axisBottom()
          .scale(xScale)
          .ticks(d3.timeMonth.every(1))
    if(date.length==4){
      xAxis.tickFormat(d3.timeFormat("%m"+"周"))
    }else if(date.length==7){
      xAxis.tickFormat(d3.timeFormat("%m"+"天"))
    }else if(date.length==8){
      xAxis.tickFormat(d3.timeFormat("%m"+"月"))
    }
    main.append('g')
        .attr('class', 'pie-axisX')
        .attr('transform', 'translate(0,' + (width - padding.left - padding.right) + ')')
        .call(xAxis)
        .style("fill","none")
        .selectAll(".tick text")
        .style("text-anchor", "start")
        .attr("x", 60)
        .attr("y", 10)
    date.map((d, i)=>{
      var pi = Math.PI;
      var startAngle = 0
      var endAngle = d[users[0]] * (pi/180)*0.9
      for(var i=0;i<4;i++){
        var arc = d3.arc()
        .innerRadius(xScale(timeParse(d.Date)))
        .outerRadius(xScale(timeParse(Number(d.Date)+1)))
        .startAngle(startAngle)
        .endAngle(endAngle)
        startAngle = Number(startAngle)+Number(d[users[i]] * (pi/180)*0.9)
        endAngle = Number(endAngle)+Number(d[users[i+1]]) * (pi/180)*0.9
        var circle = svg.append("path")
          .attr("d", arc())
          .transition().duration(750)
          .attr("transform", 'translate('+padding.bottom + "," + (height - padding.top) + ')')
          .attr("fill",(d)=>{ return colors[i]})
          .style("stroke","white")
          .attr("class","pie-path")

        arc = svg.append("text")
                  .text(d[users[i]]+"%")
                  .attr("transform", 'translate(' + padding.bottom + "," + (height - padding.top) + ')')
                  .attr("transform", function(d) {
                    var c = arc.centroid(d);
                    return "translate(" + (40+c[0]) +"," + (height+c[1]-padding.bottom) + ")";
                    })
                  .style("fill","white")
                  .style("stroke","none")
                  .style("font-size","12px")
                  .attr("class","pie-text")
        }
      var arc2 = d3.arc()
          .innerRadius( xScale(timeParse(d.Date)))
          .outerRadius(xScale(timeParse(Number(d.Date)+1)))
          .startAngle(0)
          .endAngle(180 * (2*pi/180))
      var circle2 = svg.append("path")
          .attr("d", arc2())
          .attr("transform", 'translate('+padding.bottom + "," + (height - padding.top) + ')')
          .attr("fill", "none")
          .attr("class","dash-circle")
          .attr("stroke","white")
          .style("stroke-dasharray", "2,4")
      })
  }
}
var width = 600, height = 600;
var padding = { top: 50, right: 50, bottom: 50, left: 50 };
var svg = d3.select(".pie-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color","#333333");
var main = svg.append('g')
              .classed('main', true)
              .attr('transform', "translate(" + padding.top + ',' + padding.left + ')');
var users = ["UserA","UserB","UserC","UserD"]
var titles = ["已登录但未注册","已登录但未对话","有1次对话","有5次对话"]
var colors = ["#3adba8","#fc6c73","#b366ba","#4f8ebf"]
var defaultData = dataset.filter((d, index) => { return index < 8 })
const chart = new PieChart({main:main,data:defaultData})

    let date
    const reloadData = () => {
      if (date == "month") {
        chart.updatePie(dataset.filter((d, index) => { return index < 8 }))
      } else if (date == "week") {
        chart.updatePie(dataset.filter((d, index) => { return index > 7 && index < 12 }))
      } else {
        chart.updatePie(dataset.filter((d, index) => { return index > 11 }))
      }
    }
    d3.selectAll('select#select-date').on('change', () => {
       date = d3.selectAll('select#select-date').property('value')
       reloadData()
    })
