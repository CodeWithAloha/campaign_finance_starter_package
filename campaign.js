$(document).ready(function() {
  console.log('page read');
  d3.selectAll("p").style('color', 'green');
  d3.selectAll("p")
    .data([4, 8, 15, 16, 23, 42])
    .style("font-size", function(d) { return d + "px"; });
  d3.select("body").selectAll("p")
    .data([4, 8, 15, 16, 23, 42])
    .enter().append("p")
    .text(function(d) { return "I’m number " + d + "!"; });
  //http://soda.demo.socrata.com/resource/earthquakes.json?$limit=5&$order=datetime DESC
  //var url = 'http://soda.demo.socrata.com/resource/earthquakes.json?$limit=5&$order=datetime DESC'
  //var url = 'https://data.hawaii.gov/Community/Campaign-Contributions-Received-By-Hawaii-State-an/jexd-xbcg.json?$limit=5'
  var url = 'https://data.hawaii.gov/resource/jexd-xbcg.json?$limit=10'
  var url = 'https://data.hawaii.gov/resource/3maa-4fgr.json'
  $.get( url, function( data ) {
    console.log( "Load was performed." );
    console.log("got data" + JSON.stringify(data));
    console.log('content div is ' + $('#content-div'));
    var table = tabulate(data, ['contributor_name', 'candidate_name', 'amount', "contributor_type", "street_address_1"]);

    var myChart = simpleBarChart().width(200).height(50);
    var vals = [5,10,15,60,12,15,17];
    var days = ['M','Tu','W','Th','Fr','Sa','Su'];
    //var mydata = days.map(function(d,i){return {"value":vals[i],"day":days[i]};});
    var mydata = data.map(function(d,i){return {'value':data[i]['amount'],'day':data[i]['contributor_name']}})

    d3.selectAll("#p1")
          .datum(mydata)
                .call(myChart);

    // Want to sum up all the Abe, Michael's
    //barChart(data);

    var nest = d3.nest().
      key(function(d) { return d.contributor_name; }).
      rollup(function(leaves)
             { return {contributor_name:leaves[0].contributor_name, amount:d3.sum(leaves, function(d) {return parseFloat(d.amount);})}; }).entries(data);

    // TODO: format nicer rather formatting in the bar chart
    var mapData = nest.map(function(d) { console.log(JSON.stringify(d)); return d.values; });
    console.log('map data is ' + JSON.stringify(mapData));
    barChart(mapData);
    window.data = data;
    window.mydata = mydata;
  });
  //https://data.hawaii.gov/Community/Campaign-Contributions-Received-By-Hawaii-State-an/jexd-xbcg
});

function tabulate(data, columns) {
  console.log('in tabulate');
  var table = d3.select("#container").append("table"),
    thead = table.append("thead"),
    tbody = table.append("tbody");

  // append the header row
  thead.append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
      .text(function(column) { return column; });

  // create a row for each object in the data
  var rows = tbody.selectAll("tr")
    .data(data)
    .enter()
    .append("tr");

  // create a cell in each row for each column
  var cells = rows.selectAll("td")
    .data(function(row) {
      return columns.map(function(column) {
        return {column: column, value: row[column]};
      });
    })
    .enter()
    .append("td")
      .text(function(d) { return d.value; });

  return table;
}

// create some people
var people = [
  {name: "Jill", age: 30},
  {name: "Bob", age: 32},
  {name: "George", age: 29},
  {name: "Sally", age: 31}
];

console.log('created some people');

// render the table
$(document).ready(function() {
  return;
  var peopleTable = tabulate(people, ["name", "age"]);

  // uppercase the column headers
  peopleTable.selectAll("thead th")
    .text(function(column) {
      return column.charAt(0).toUpperCase() + column.substr(1);
    });

  // sort by age
  peopleTable.selectAll("tbody tr")
    .sort(function(a, b) {
      return d3.descending(a.age, b.age);
    });
});
