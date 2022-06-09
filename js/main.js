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

let listOfSources = [
  "https://raw.githubusercontent.com/juweek/datasets/main/FastFoodRestaurantData.csv",
  "https://raw.githubusercontent.com/juweek/datasets/main/FastFoodRestaurantData.csv",
  "https://raw.githubusercontent.com/juweek/datasets/main/FastFoodRestaurantData.csv",
];

let listOfColors = [
  ["E18A86","844440","FEDF70"],
  ["0E68B0","fff","EB7921"],
  ["7A69A1","fff","FDBFD6"]
];

/*
------------------------------
METHOD: fetch the data and draw the chart 
------------------------------
*/
function update(svg, url, x) {
  d3.csv(url).then(function (data) {
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
      .attr("transform", function (d) {
        return "translate(" + projection([d.Longitude, d.Latitude]) + ")";
      })
      .attr("r", function (d) {
        return 3;
      })
      .style("fill", '#' + listOfColors[x][2])
      .style("opacity", 0.55);
  });
}

for (let x = 0; x < listOfSources.length; x++) {
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
        .select("#svganchor" + x)
        .append("svg")
        .attr("viewBox", [0, 0, 975, 610]);

      // outline us map
      svg
        .append("path")
        .datum(topojson.feature(us, us.objects.nation))
        .attr("fill", '#' + listOfColors[x][0])
        .attr("d", path);

      // outline state border
      svg
        .append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", '#' + listOfColors[x][1])
        .attr("stroke-linejoin", "round")
        .attr("d", path);

      update(svg, listOfSources[x], x);
    })
    .catch(function (error) {
      console.log(error);
    });
}
