// const api = "https://api.iextrading.com/1.0/stock/?symbols=fb"
let api = "https://api.iextrading.com/1.0/stock/aapl/company";
let stockApi = "https://api.iextrading.com/1.0/stock/aapl/chart/1m";
let stockList = "https://api.iextrading.com/1.0/ref-data/symbols";
let textInput = document.getElementById("textInput");
let menuContainer = document.getElementById("menuContainer");
let companyArrow = document.getElementById("companyArrow");
let stockArrow = document.getElementById("stockArrow");
let tickerListContainer = document.getElementById("tickerListContainer");
let currentCompanies = ["aapl"];
let colors = ["blue", "red"]

document.getElementById("menuOffclick").addEventListener("click", (event) => {
  d3.select("#menuContainer").attr("class", "default-menu close-menu");
  d3.select("#menuOffclick").attr("class", "menu-offclick hide");
});

document.getElementById("companyInfo").addEventListener("click", (event) => {
  if (companyArrow.className.includes("default-arrow") ||
      companyArrow.className.includes("close-arrow")) {
    d3.select("#companyInfoContainer").attr("class", "grow-info");
    d3.select("#companyArrow")
    .attr("class", "fa fa-angle-right open-arrow");
  } else if (companyArrow.className.includes("open-arrow")) {
    d3.select("#companyInfoContainer").attr("class", "shrink-info");
    d3.select("#companyArrow")
    .attr("class", "fa fa-angle-right close-arrow");
  }
});

document.getElementById("stockInfo").addEventListener("click", (event) => {
  if (stockArrow.className.includes("close-arrow")) {
    d3.select("#stockInfoContainer").attr("class", "graph grow-graph");
    d3.select("#stockArrow")
    .attr("class", "fa fa-angle-right open-arrow");
  } else if (stockArrow.className.includes("open-arrow")) {
    d3.select("#stockInfoContainer").attr("class", "close-graph shrink-graph");
    d3.select("#stockArrow")
    .attr("class", "fa fa-angle-right close-arrow");
  }
});

tickerListContainer.addEventListener("click", (event) => {
  fetchNewData(event.target.innerHTML);
});

document.getElementsByName("toggleMenuButton").forEach((element) => {element.addEventListener("click", (event) => {
  if (menuContainer.className.includes("start-menu")) {
    d3.select("#menuOffclick").attr("class", "menu-offclick");
    d3.select("#menuContainer").attr("class", "default-menu open-menu")
  } else if (menuContainer.className.includes("open-menu")) {
    d3.select("#menuOffclick").attr("class", "menu-offclick hide");
    d3.select("#menuContainer").attr("class", "default-menu close-menu")
  } else if (menuContainer.className.includes("close-menu")) {
    d3.select("#menuOffclick").attr("class", "menu-offclick");
    d3.select("#menuContainer").attr("class", "default-menu open-menu")
  }})
});


document.addEventListener("DOMContentLoaded", (event) => {
  return (
    fetchMenuTickers(),
    fetch(api).then((response) => { response.json().then((response) => {
    let result = parseData(response);
    window.setTimeout(() => {switchData(result)}, 500)
  });}).then(() => {fetchStockData(currentCompanies[0])})/* --- fetch Stock Data goes here*/
  )
});

document.getElementById("textSubmit").addEventListener("click", (event) => {
  if (textInput.value.length > 0) {
    fetchNewData(textInput.value);
  };
});


const parseData = function(data) {
  let returnObject = {
    companyName: "",
    CEO: "",
    description: "",
    exchange: "",
    industry: "",
    issueType: "",
    sector: "",
    symbol: "",
    tags: "",
    website: "",
  };

  if (data.companyName) {
    returnObject.companyName = data.companyName;
  }
  if (data.CEO) {
    returnObject.CEO = data.CEO;
  }
  if (data.description) {
    returnObject.description = data.description;
  }
  if (data.exchange) {
    returnObject.exchange = data.exchange;
  }
  if (data.industry) {
    returnObject.industry = data.industry;
  }
  if (data.issueType) {
    returnObject.issueType = data.issueType;
  }
  if (data.sector) {
    returnObject.sector = data.sector;
  }
  if (data.symbol) {
    returnObject.symbol = data.symbol;
  }
  if (data.tags) {
    let tagReturn = "";
    data.tags.forEach((tag, idx) => {
      tagReturn += tag;
      if (data.tags[idx + 1]) {
        tagReturn += ", ";
      }
    });
    returnObject.tags = tagReturn;
  }
  if (data.website) {
    returnObject.website = data.website;
  }
  return returnObject;
}

// MENU MANIPULATION
const toggleMenu = function() {

}


/*
Used to switch the data currently on the screen with the loaded information
During the switch, I switch back to the loading screen and ensure that the company
information tab is closed while also switching to the new information
*/
const switchData = function(result) {
  d3.select("#companyInfoContainer").attr("class", "default-info-container")
  d3.select("#companyArrow").attr("class", "fa fa-angle-right default-arrow");
  d3.select("#main").attr("class", "main-container");
  d3.select("#loader").attr("class", "loader hide");
  d3.select("#companyTitle")
  .text(result.companyName)
  .attr("class", "title-text")

  d3.select("#ciwebsite").text(result.website).attr("href", result.website);
  d3.select("#cicompany").text(result.companyName);
  d3.select("#citags").text(result.tags);
  d3.select("#ciCEO").text(result.CEO);
  d3.select("#ciexchange").text(result.exchange);
  d3.select("#cisector").text(result.sector);
  d3.select("#citicker").text(result.symbol);
  d3.select("#ciIssueType").text(result.issueType);
  d3.select("#cidescription").text(result.description);
}


const fetchNewData = function(input) {
  return (
    hideInfo(),
    currentCompanies.push(input),
    fetch(createCompanyApi(input)).then((response) => { response.json().then((response) => {
      let result = parseData(response);
        window.setTimeout(() => {switchData(result)}, 500)
      })
    }).then(fetchStockData(input))
  )
}

const fetchMenuTickers = function() {
  return (
    fetch(stockList).then((response) => {
      response.json().then((result) => {
        let currentListNum = parseFloat(tickerListContainer.getAttribute("data"))
        for (var i = 0; i < result.length; i++) {
          let element = document.createElement("div");
          element.innerHTML = `${result[i].symbol}`;
          element.setAttribute("id", "tickerListItem");
          element.setAttribute("class", "ticker-list-item noselect")
          element.setAttribute("data", result[i]);
          d3.select("#tickerListContainer").append(function() {
            return element;
          })
        }
      })
    })
  )
}

const hideInfo = function () {
  d3.select("#main").attr("class", "main-container hide");
  d3.select("#loader").attr("class", "loader");
}

const createCompanyApi = function(input) {
  let api = `https://api.iextrading.com/1.0/stock/${input}/company`;
  return api;
}

const fetchStockData = function(company, timeframe) {
  let api = createStockApi(company, timeframe);

  return (
    fetch(api).then((response) => { response.json().then((data) => {
      drawChart(parseStockData(data), "red")
      })
    })
  )
}

const parseStockData = function(data) {
  let stockArr = [];
  for (var i = 0; i < data.length; i++) {
    stockArr.push({
      date: new Date(data[i].date),
      value: parseInt(data[i].close)
    });
  }

  return stockArr;
}

const createStockApi = function(company, timeframe) {
  if (!timeframe) {
    return `https://api.iextrading.com/1.0/stock/${company}/chart/1m`;
  } else {
    return `https://api.iextrading.com/1.0/stock/${company}/chart/${timeframe}`;
  }
}

/* https://chartio.com/resources/tutorials/how-to-resize-an-svg-when-the-window-is-resized-in-d3-js/
  How to resize the chart to fit the current window size.
*/
const drawChart = function(data, color) {
  d3.selectAll("svg > *").remove();
  let svgWidth = 600, svgHeight = 400;
  let margin = { top: 20, right: 20, bottom: 30, left: 50 }
  let width = svgWidth - margin.left - margin.right;
  let height = svgHeight - margin.top - margin.bottom;
  let svg = d3.select("#svg")

  let g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let x = d3.scaleTime()
  .rangeRound([0, width]);

  let y = d3.scaleLinear()
  .rangeRound([height, 0]);

  let line = d3.line()
  .x(function(d) { return x(d.date)})
  .y(function(d) { return y(d.value)})
  x.domain(d3.extent(data, function(d) { return d.date}));
  y.domain(d3.extent(data, function(d) { return d.value}));

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .select(".domain")
    .remove();

  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Price ($)");

  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);

    console.log(svg);
}
