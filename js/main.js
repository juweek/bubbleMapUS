/*
------------------------------
METHOD: set the size of the canvas
------------------------------
*/
const width = 1300; // Chart width
const height = 800; // Chart height
const margin = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

/*
------------------------------
METHOD: fetch the data and draw the chart 
------------------------------
*/
function update(svg, us, radius) {
  d3.csv(
    "https://raw.githubusercontent.com/juweek/datasets/main/FastFoodRestaurantData.csv"
  ).then(function (data) {
    // D3 Projection
    var projection = d3
      .geoAlbersUsa()
	  .translate([width / 2.65, height / 2.65]) // translate to center of screen
      .scale([1300]); // scale things down so see entire US

    // Define path generator
    var path = d3
      .geoPath() // path generator that will convert GeoJSON to SVG paths
      .projection(projection); // tell path generator to use albersUsa projection

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "franchiseCircle")
	  .attr("transform", function(d) {return "translate(" + projection([d.Longitude, d.Latitude]) + ")";})
	  /*
      .attr("cx", function (d) {
        let currentProject = projection([d.Longitude, d.Latitude]);
        if (currentProject != null) {
          return currentProject[0];
        } else {
          return 0;
        }
      })
      .attr("cy", function (d) {
        let currentProject = projection([d.Longitude, d.Latitude]);
        if (currentProject != null) {
          return currentProject[1];
        } else {
          return 0;
        }
      })
	  */
      .attr("r", function (d) {
        return 3;
      })
      .style("fill", "rgb(217,91,67)")
      .style("opacity", 0.55);
  });
}

/*
------------------------------
METHOD: load in the map
------------------------------
*/
d3.json(
  "https://raw.githubusercontent.com/xuanyoulim/fcc-internet-complaints-map/master/counties-albers-10m.json"
)
  .then(function (us) {
    path = d3.geoPath();

    const svg = d3
      .select("#svganchor")
      .append("svg")
      .attr("viewBox", [0, 0, 975, 610]);

    // outline us map
    svg
      .append("path")
      .datum(topojson.feature(us, us.objects.nation))
      .attr("fill", "#ccc")
      .attr("d", path);

    // outline state border
    svg
      .append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);

    // for circle
    svg
      .append("g")
      .attr("fill", "brown")
      .attr("fill-opacity", 0.5)
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5);

    radius = d3.scaleSqrt([450, 1100], [0, 45]);

    // Create tooltip div and make it invisible
    let tooltip = d3
      .select("#svganchor")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    d3.selectAll("circle")
      .on("mousemove", function (d) {
        tooltip
          .html(
            `<strong>$${d.target.__data__.id}</strong><br>
					  <strong>Population: </strong>${d.target.__data__.population}`
          )
          .style("top", d.pageY - 12 + "px")
          .style("left", d.pageX + 25 + "px")
          .style("opacity", 0.9);

        xLine
          .attr("x1", d3.select(this).attr("cx"))
          .attr("y1", d3.select(this).attr("cy"))
          .attr("y2", height - margin.bottom)
          .attr("x2", d3.select(this).attr("cx"))
          .attr("opacity", 1);
      })
      .on("mouseout", function (_) {
        tooltip.style("opacity", 0);
        xLine.attr("opacity", 0);
      });

    update(svg, us, radius);
  })
  .catch(function (error) {
    console.log(error);
  });
