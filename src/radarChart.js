var d3 = require("d3")
require("./styles/radarChart.styl")
var data = require('./data/data.csv')
class RadarChart {
  constructor(options){
    this.svg = options.svg
    this.width = options.width
    this.height = options.height
    this.g = this.svg.append("g").attr("transform", "translate(" + this.width/2 + "," + 50 + ")")
    this.timeParse = d3.timeParse("%m")
    this.data = options.data
    this.filterdates = this.data.filter((d,index)=>{return String(index).match(/^(5|11|17|23|29|35)$/g)})
    this.dates = this.filterdates.map((d) => { return this.timeParse(d.date) })
    this.xScale = d3.scaleTime().domain([d3.min(this.dates), d3.max(this.dates)]).range([0, 150])
    this.defaultData = this.data.filter((d,index)=>{return index<6 })
    this.xAxis = d3.axisBottom()
            .scale(this.xScale)
            .tickFormat(d3.timeFormat("%m"+"月"));
    this.roundCircle()
    this.roundLine()
    this.roundText()
    this.roundPoint()
  }
  roundCircle(){
    var insideCircle = this.g.attr("transform", "translate(" + this.width/2 + "," + 350 + ")")
          .append("circle")
          .attr("cx",0)
          .attr("cy",0)
          .attr("r",120)
          .attr("fill","#3a393e")
    var outCircle = this.g.attr("transform", "translate(" + this.width/2 + "," + 350 + ")")
          .append("circle")
          .attr("cx",0)
          .attr("cy",0)
          .attr("r",130)
          .attr("stroke","white")
          .attr("fill", "none")
  }
  roundLine(){
    const polygonLine = d3.line().x((d) => d[0]).y((d) => d[1])
    const lineUnits = [0, 1/3, 2/3, 1, 4/3, 5/3, 2].map((d) => d * Math.PI)
    const linePoints = this.defaultData.map((d, index) => {
      return [
        (Math.cos(lineUnits[index])) * d.value + 300,
        (Math.sin(lineUnits[index])) * d.value + 350
      ]
    })
    this.svg.append('path')
      .attr('d', polygonLine(linePoints))
      .attr('stroke', 'none')
      .attr('stroke-width', 2)
      .attr("class","round-line")
      .attr('fill', 'rgba(148,148,148,0.64)')
      .attr('fill-opacity', 0.75)
  }
  roundText() {
    var txts = ['关注','观点','提问','搜索','计划','问答']
    txts.map((d,i)=>{
      const straightLine = d3.line().x((d) => d[0]).y((d) => d[1])
      var gl = this.svg.append("g").attr("transform", "translate(" + width/2 + "," + 350 + ")");
    gl.append('path')
      .attr('d', straightLine([[ 20 * Math.cos(2*Math.PI/6*i),
         20 * Math.sin(2*Math.PI/6*i)], [width/4 * Math.cos(2*Math.PI/6*i), height/4 * Math.sin(2*Math.PI/6*i)]]))
      .attr('stroke', '#fff').attr('fill', 'none')
        var text = this.g.append("g")
          .append("text")
          .text(txts[i])
          .attr("dy", "0.35em")
          .attr("transform", "translate(" + width/4 * Math.cos(2*Math.PI/6*i) + "," + height/4 * Math.sin(2*Math.PI/6*i) + ")")
          .style("stroke","none")
          .style("fill","white")

      if(i == 3){
        text.attr("transform", "translate(" + width/3.3 * Math.cos(2*Math.PI/6*i) + "," + height/4 * Math.sin(2*Math.PI/6*i) + ")rotate("+ i*240+")")
      }else{
        text.attr("transform", "translate(" + width/4 * Math.cos(2*Math.PI/6*i) + "," + height/4 * Math.sin(2*Math.PI/6*i) + ")rotate("+ i*60+")")
      }
     })
  }
  roundPoint(){
    var strokeCircle = new Array()
    var fillCircle = new Array()
    var tooltip = d3.select(".radar-chart").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0)
    this.defaultData.map((item, index) => {
      // 空心点
       var strokePoint = this.g.append("g")
        .append("circle")
        .attr("cx", item.value/100*width/6 * Math.cos(2*Math.PI/6*index))
        .attr("cy", item.value/100*width/6 * Math.sin(2*Math.PI/6*index))
        .attr("r", 6)
        .attr("class","stCircle")
        .style("stroke","white")
        .style("fill","none")
      //小实心点
    var fillPoint = this.g.append("g")
        .append("circle")
        .attr("cx", item.value/100*width/6 * Math.cos(2*Math.PI/6*index))
        .attr("cy", item.value/100*width/6 * Math.sin(2*Math.PI/6*index))
        .attr("r", 3)
        .attr("class","fill-circle")
        .style("stroke","none")
        .style("fill","white").on("mouseover", function(d) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0.85);
            tooltip.html("<strong>" + item.value +"</strong>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          }).on("mouseout", function(d) {
            tooltip.transition()
              .duration(300)
              .style("opacity", 0);
          })
      strokeCircle.push(strokePoint)
      fillCircle.push(fillPoint)
    })
    var g = this.svg.append("g").attr("transform", "translate(" + this.width/2 + "," + 50 + ")");
    var dragCircle = g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height/2 + ")")
      .style("opacity", 0)
      .call(this.xAxis)
    const draggable = d3.drag()
      .on('start', () => {
        tooltip.transition()
              .duration(300)
              .style("opacity", 0)
        dragCircle.transition()
          .duration(200)
          .style("opacity", 1)})
      .on('drag', () => {
        tooltip.transition()
              .duration(300)
              .style("opacity", 0)
      const distance = []
      this.filterdates.map((d, i)=>{
        distance.push(Math.floor(this.xScale(this.timeParse(d.date))))
        })
      if( d3.event.x > d3.min(distance) && d3.event.x < d3.max(distance)){
      dragScircle.attr('cx', d3.event.x)
      dragFcircle.attr('cx', d3.event.x)}
      this.filterdates.map((d, i)=>{
        if(Math.floor(d3.event.x) == Math.floor(this.xScale(this.timeParse(d.date)))){
          month = ++i
          months.text(month+"月")
          }
        })
    })
      .on("end", function(d) {
          reloadData()
          tooltip.transition()
              .duration(300)
              .style("opacity", 0)
          dragCircle.transition()
            .duration(500)
            .style("opacity", 0);
          })
    const ripple = ()=>{
      strokeCircle[0]
            .call(draggable)
            .attr("r", 0)
            .style("stroke-opacity",1)
            .transition()
            .duration(1000)
            .ease(d3.easeQuadIn)
            .attr("r", 8)
            .transition()
            .duration(500)
            .ease(d3.easeQuadIn)
            .style("stroke-opacity",0)
            // .transition()
            // .duration(500)
            // .ease(d3.easeQuadIn)

    }
    const dragScircle = strokeCircle[0]
            .call(draggable)
            .call(ripple)
            setInterval(ripple, 2200)
    const dragFcircle = fillCircle[0].attr("r",3)
            .call(draggable)
            .style("cursor","pointer")
    var months = g.append("text")
            .text(month+"月")
            .attr("x", 180)
            .attr("y", 150)
            .attr("class","month-text")
            .style("font-size","20px")
            .style("stroke","none")
            .style("fill","white")
  }
  updateChart(data){
    this.svg.selectAll('.round-line').remove()
    this.svg.selectAll('.stCircle').remove()
    this.svg.selectAll('.fill-circle').remove()
    this.svg.selectAll('.month-text').remove()
    const polygonLine = d3.line().x((d) => d[0]).y((d) => d[1])
    const lineUnits = [0, 1/3, 2/3, 1, 4/3, 5/3, 2].map((d) => d * Math.PI)
    const linePoints = data.map((d, index) => {
      return [
        (Math.cos(lineUnits[index])) * d.value + 300,
        (Math.sin(lineUnits[index])) * d.value + 350
      ]
    })
    this.svg.append('path')
      .attr('d', polygonLine(linePoints))
      .transition().duration(500)
      .attr('stroke', 'none')
      .attr("class","round-line")
      .attr('stroke-width', 2)
      .attr('fill', 'rgba(148,148,148,0.64)')
      .attr('fill-opacity', 0.75)
    var strokeCircle = new Array()
    var fillCircle = new Array()
    var tooltip = d3.select(".radar-chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    data.map((item, index) => {
      var g = this.svg.append("g").attr("transform", "translate(" + width/2 + "," + 350 + ")");
      // 空心点
      var strokePoint = g.append("g")
        .append("circle")
        .attr("cx", item.value/100*width/6 * Math.cos(2*Math.PI/6*index))
        .attr("cy", item.value/100*width/6 * Math.sin(2*Math.PI/6*index))
        .attr("r", 6)
        .attr("class","stCircle")
        .style("stroke","white")
        .style("fill","none")
      //小实心点
      var fillPoint = g.append("g")
          .append("circle")
          .attr("cx", item.value/100*width/6 * Math.cos(2*Math.PI/6*index))
          .attr("cy", item.value/100*width/6 * Math.sin(2*Math.PI/6*index))
          .attr("r", 3)
          .attr("class","fill-circle")
          .style("stroke","none")
          .style("fill","white").on("mouseover", function(d) {
              tooltip.transition()
                .duration(500)
                .style("opacity", 0.85);
              tooltip.html("<strong>" + item.value +"</strong>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            }).on("mouseout", function(d) {
              tooltip.transition()
                .duration(300)
                .style("opacity", 0);
            })
      strokeCircle.push(strokePoint)
      fillCircle.push(fillPoint)
    })
    var g = svg.append("g").attr("transform", "translate(" + this.width/2 + "," + 50 + ")");
    var dragCircle = g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height/2 + ")")
      .style("opacity", 0)
      .call(this.xAxis)
    const draggable = d3.drag()
      .on('start', () => {
        tooltip.transition()
              .duration(300)
              .style("opacity", 0)
        dragCircle.transition()
          .duration(200)
          .style("opacity", 1)})
      .on('drag', () => {
        tooltip.transition()
              .duration(300)
              .style("opacity", 0);
      const distance = []
      this.filterdates.map((d, i)=>{
        distance.push(Math.floor(this.xScale(this.timeParse(d.date))))
      })
      if( d3.event.x > d3.min(distance) && d3.event.x < d3.max(distance)){
      dragScircle.attr('cx', d3.event.x)
      dragFcircle.attr('cx', d3.event.x)}
      this.filterdates.map((d, i)=>{
        if(Math.floor(d3.event.x) == Math.floor(this.xScale(this.timeParse(d.date)))){
          month = ++i
          months.text(month+"月")
          }
        })
    }).on("end", function(d) {
        reloadData()
        dragCircle.transition()
          .duration(500)
          .style("opacity", 0);
        tooltip.transition()
              .duration(300)
              .style("opacity", 0);
      })
    const dragScircle = strokeCircle[0].attr("r",6)
            .call(draggable)
            .style("cursor","pointer")
    const dragFcircle = fillCircle[0].attr("r",3)
            .call(draggable)
            .style("cursor","pointer")
    var months = g.append("text")
              .text(month+"月")
              .attr("x", 180)
              .attr("y", 150)
              .attr("class","month-text")
              .style("font-size","20px")
              .style("stroke","none")
              .style("fill","white")
  }
}

var width = 600, height = 600;
var svg = d3.select(".radar-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color","#333333")
var month = 1
const radarchart = new RadarChart({svg:svg,data:data,width:width,height:height})
const reloadData = () => {
  if (month == 1) {
    radarchart.updateChart(data.filter((d,index)=>{return index<6}))
  } else if (month == 2) {
    radarchart.updateChart(data.filter((d,index)=>{return index>5&&index<12}))
  } else if (month == 3) {
    radarchart.updateChart(data.filter((d,index)=>{return index>11&&index<18}))
  } else if (month == 4) {
    radarchart.updateChart(data.filter((d,index)=>{return index>17&&index<24}))
  } else if (month == 5) {
    radarchart.updateChart(data.filter((d,index)=>{return index>23&&index<30}))
  }else if(month == 6) {
    radarchart.updateChart(data.filter((d,index)=>{return index>29&&index<36}))
  }
}
