// set the dimensions and margins of the graph
var width = 500
    height = 500
    margin = 40
var radius = Math.min(width, height) / 2 - margin

var svg = d3.select("#pichart")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// create 2 data_set
var data1 = {a: 9, b: 20, c:30, d:8, e:12}
var data2 = {a: 6, b: 16, c:20, d:14, e:19, f:12}


  d3.csv("PHX.csv", function(data) {
    const bins = d3.range(10, 110, 10);
  
    const histogram = d3.histogram()
      .value(d => parseInt(d.data))
      .domain([0, 100])
      .thresholds(bins);
  
    const filteredData = histogram(data.filter(d => d.actual_mean_temp >= 10 && d.actual_mean_temp <= 100));
  
    const nestedData = d3.nest()
      .key(d => `${d.x0} to ${d.x1 - 1}`)
      .rollup(d => d.length)
      .entries(filteredData);
  
    console.log(nestedData);
  });

// set the color scale
var color = d3.scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f"])
  .range(d3.schemeDark2);

// A function that create / update the plot for a given variable:
function update(data) {

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  var data_ready = pie(d3.entries(data))

  // map to data
  var u = svg.selectAll("path")
    .data(data_ready)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .enter()
    .append('path')
    .merge(u)
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)

  u
    .exit()
    .remove()

}

// Initialize the plot with the first dataset
update(data1)