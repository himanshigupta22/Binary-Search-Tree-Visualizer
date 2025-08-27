export const plot = (treeData, currValue,isInserting) => {
  var margin = { top: 50, right: 10, bottom: 50, left: 10 },
    width = window.innerWidth - margin.left - margin.right - 250 + ((window.innerWidth >= 760) ? 0 : 70),
    height = window.innerHeight - margin.top - margin.bottom - 100;
  var treemap = d3.tree().size([width, height]);
  var nodes = d3.hierarchy(treeData);
  nodes = treemap(nodes);
  var svg = d3
    .select(".vis-container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`),
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  addLink(g,nodes,currValue,isInserting);
  addNode(g,nodes, currValue,isInserting);
};
function addNode(g,nodes, currValue,isInserting) {
  var node = g
    .selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("g")
    .attr("class", function (d) {
      return "node" + (d.children ? " node--internal" : " node--leaf") + (d.data.name == currValue ? " recent" : "");
    })
    .attr("transform", function (d) {
      if (isInserting==true && d.parent && d.data.name == currValue) {
        return "translate(" + d.parent.x + "," + d.parent.y + ")";
      } else {
        return "translate(" + d.x + "," + d.y + ")";
      }
    });
  node
    .transition()
    .duration(1000)
    .attr("transform", d => {
      return "translate(" + d.x + "," + d.y + ")";
    });
  node.append("circle")
    .attr("r", function (d) {
      return d.data.name == currValue ? 5 : 20;
    })
    .transition()
    .duration(function (d) {
      return d.data.name == currValue ? 500 : 0;
    })
    .attr("r", d=>{
      if(Math.abs(d.data.name) > 1000) return 25;
      return 20;
    });

  node
    .append("text")
    .attr("dy", ".35em")
    .attr("y", function (d) {
      return 0;
    })
    .style("text-anchor", "middle")
    .text(function (d) {
      return d.data.name;
    });
}

function addLink(g, nodes, currValue, isInserting) {
  var link = g
    .selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", function (d) {
      return "link" + (d.data.name == currValue ? " recent" : "");
    })
    .attr("d", function (d) {
      if (isInserting == true && d.data.name == currValue) {
        return "M" + d.parent.x + "," + d.parent.y + "L" + d.parent.x + "," + d.parent.y;
      } else {
        return "M" + d.parent.x + "," + d.parent.y + "L" + d.x + "," + d.y;
      }
    });

  link
    .transition()
    .duration(1000)
    .attr("d", function (d) {
      return "M" + d.parent.x + "," + d.parent.y + "L" + d.x + "," + d.y;
    });
}