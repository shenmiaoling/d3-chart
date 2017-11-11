var d3 = require("d3")
require("./styles/bubbleChart.styl")
    var width = 700, height = 300;
    // SVG画布边缘与图表内容的距离
    var padding = { top: 50, right: 50, bottom: 50, left: 50 };
    // 创建一个分组用来组合要画的图表元素
    var svg = d3.select(".bubble-chart")
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height);
    var main = svg.append('g')
            .classed('main', true)
            .attr('transform', "translate(" + padding.top + ',' + padding.left + ')');
    var tooltip = d3.select(".bubble-chart").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
    // 模拟数据
    var dataset = [
        { x: 69, y: 45, weight: 5 },{ x: 30, y: 37, weight: 10 },
        { x: 43, y: 10, weight: 23 },{ x: 54, y: 48, weight: 41 },
        { x: 18, y: 18, weight: 41 },{ x: 88, y: 21, weight: 32 },
        { x: 45, y: 48, weight: 12 },{ x: 14, y: 32, weight: 9 },
        { x: 78, y: 18, weight: 16 },{ x: 13, y: 45, weight: 32 }
    ];
    // 添加x轴和y轴
    var xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width - padding.left - padding.right]);
    var yScale = d3.scaleLinear()
            .domain([0, 50])
            .range([height - padding.top - padding.bottom, 0]);
    var xAxis = d3.axisTop()
            .scale(xScale)

    var yAxis = d3.axisRight()
            .scale(yScale)


    main.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + (height - padding.top - padding.bottom) + ')')
            .call(xAxis)
    main.append("text")
            .text("投资风险率")
            .attr("x", xScale(xScale.ticks().pop())-padding.right)
            .attr("y", height-padding.bottom-padding.top/2);
    main.append('g')
            .attr('class', 'axis')
            .call(yAxis);
    // 添加气泡
    main.selectAll('.bubble')
            .data(dataset)
            .enter()
            .append('circle')
            .attr('class', 'bubble')
            .attr('cx', function(d) {
                return xScale(d.x);
            })
            .attr('cy', function(d) {
                return yScale(d.y);
            })
            .attr('r', function(d) {
                return d.weight;
            })
            .on("mouseover", function(d) {

          tooltip.transition()
            .duration(500)
            .style("opacity", 0.85);
          tooltip.html("<strong>" + d.x+"%"+","+d.y+"%"+","+d.weight +"</strong>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
          tooltip.transition()
            .duration(300)
            .style("opacity", 0);
        });
