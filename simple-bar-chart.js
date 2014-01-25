function simpleBarChart() {
  var width = 220, // default width
      height = 60, // default height
      x= d3.scale.ordinal()
          .rangeRoundBands([0, width], .1),
      y= d3.scale.linear()
          .range([height, 0]),
      defaultMargin = 5,
      margin = {left:defaultMargin,right:defaultMargin,top:defaultMargin,bottom:defaultMargin+15},
      xAxis= d3.svg.axis()
          .scale(x)
          .orient("bottom"),
      yAxis= d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickSize(0),
      svg=null,
      xaxis,
      yaxis;

  function my(selection) {
      selection.each(function(d, i) {
          // `d` is the data and `this` is the element
          // using `width` and `height`
           if (svg == null)               
           {svg = d3.select(this).append("svg");
            
           x.domain(d.map(function(d) { return d.day; }));
           y.domain([0, d3.max(d, function(d) { return d.value; })]);
            
            xaxis = svg.append("g")
               .attr("class", "x axis");
               
            yaxis = svg.append("g")
               .attr("class", "y axis");
           }
                 
          xaxis.call(xAxis).attr("transform", "translate(0," + height + ")")
         ;
          yaxis.call(yAxis);
          svg
              .attr('class','none')
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

           d.forEach(function(_d) {
             _d.value = +_d.value;
           });
           console.log('this should be the dataset');
           console.log(d);            
           svg.selectAll(".bar")
               .data(d)
             .enter()
               .append("rect")
               .attr("width",1)
               .attr("class", "bar")
               .attr("x", function(d) { return x(d.day); })
               .attr("y", function(d) { return y(d.value); })
               .attr("height", function(d) { return height - y(d.value)})
               .transition()
                   .attr("width", x.rangeBand())
               ; 
      });
  }

  my.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    
      x = d3.scale.ordinal() 
          .rangeRoundBands([0, width], .1);
    
      xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");
  /* */
      return my;
  };

  my.height = function(value) {
    if (!arguments.length) return height;
    height = value;
      y = d3.scale.linear()
                .range([height, 0]);
      yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
              .tickSize(0);

    return my;
  };

    my.x = function(value) {
      if (!arguments.length) return x;
      x = value;
      return my;
    };
    my.y = function(value) {
      if (!arguments.length) return y;
      y = value;
      return my;
    };
    my.data = function(value) {
      if (!arguments.length) return data;
      data = value;

      return my;
    };

  return my;
}

//var vals = [5,10,15,60,12,15,17];
//var days = ['M','Tu','W','Th','Fr','Sa','Su'];
//var data = days.map(function(d,i){return {"value":vals[i],"day":days[i]};});
//console.log('the data is ' + JSON.stringify(data));
//
//var myChart = simpleBarChart().width(200).height(50);
//d3.selectAll("#p1")
//      .datum(data)
//      .call(myChart);
//
//var vals2 = [10,4,30,20,12,15,17];
//var days2 = ['A','B','C','D','E','F','G'];
//var data2 = days2.map(function(d,i){return {"value":vals2[i],"day":days2[i]};});
// 
//var myChart2 = simpleBarChart().width(400).height(100);
//d3.selectAll("#p2")
//      .datum(data2)
//      .call(myChart2);
//
////// trying to update here:
//vals = [35,2,35,2,32,3,37];
//data = days.map(function(d,i){return {"value":vals[i],"day":days[i]};});
//myChart.width(400).data(data);
//d3.select("#p1").datum(data).call(myChart);

