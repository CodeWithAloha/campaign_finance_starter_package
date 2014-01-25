$(document).ready(function() {
  console.log('page read');
  //var url = 'https://data.hawaii.gov/Community/Campaign-Contributions-Received-By-Hawaii-State-an/jexd-xbcg.json?$limit=5'
  var url = 'https://data.hawaii.gov/resource/jexd-xbcg.json?$limit=10'
  //var url = 'https://data.hawaii.gov/resource/3maa-4fgr.json'
  $.get( url, function( data ) {
    console.log("got data" + JSON.stringify(data));
    var table = tabulate(data, ['contributor_name', 'candidate_name', 'amount', "contributor_type", "street_address_1"]);

    var formatted_data = data.map(function(d,i){return {'value':data[i]['amount'],'day':data[i]['contributor_name']}})

    // Sum donations by contributor
    var nest = d3.nest().
      key(function(d) { return d.contributor_name; }).
      rollup(function(leaves)
             { return {contributor_name:leaves[0].contributor_name, amount:d3.sum(leaves, function(d) {return parseFloat(d.amount);})}; }).entries(data);

    var mapData = nest.map(function(d) { console.log(JSON.stringify(d)); return d.values; });
    barChart(mapData);
    // Make data accessible in the console
    window.data = data;
    window.formatted_data = formatted_data;
  });
  //https://data.hawaii.gov/Community/Campaign-Contributions-Received-By-Hawaii-State-an/jexd-xbcg
});

function tabulate(data, columns) {
  console.log('in tabulate');
  var table = d3.select("#table-container").append("table"),
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
