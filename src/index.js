//  By Friday Main Goals
// -Input field - type in confirm √
// -find coin and display current price √
// -add coins to a list √
// -arrow button that increases or decreases coin amount

//Maybes

//may need to save info into an array?
// -delete a coin button -√
//-compare two coins
//-display a graph?

// Stretch:
// -Difference in delta over a Week

//**************************************************** */
//adds event listener, sends ticker to fetch request.
coinInput();

function coinInput() {
  renderDropdown();
  const form = document.querySelector("#formInput");
  //sandbox is weird and made me put this if to clear an error
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const coinValue = event.target.tickerInput.value;
      const dropValue = event.target.weekList.value;
      getAPI(coinValue, dropValue);
    });
  }
}

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
function getAPI(coinValue, dropValue) {
  // var request = require("request");
  var url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${coinValue}&to_currency=USD&apikey=B3BGRQPX1AOZLTLP`;
  // request.get(
  fetch(url, {
    url: url,
    json: true,
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      getWeeklyValue(coinValue, dropValue);
      renderCoinObj(data);
    })
    .catch((err) => {
      console.log(err.message);
      alert("API Current has reached max use.");
      return;
    });
}

//show the coin chosen
const coinDiv = document.createElement("div");
function renderCoinObj(coin) {
  const p = document.createElement("p");
  const parentCoinDiv = document.querySelector("#coins");
  const removeBtn = document.createElement("button");
  const increaseBtn = document.createElement("button");
  const spanCurrentUsd = document.createElement("span");

  let currentUsd = [];
  currentUsd.push(
    parseInt(coin["Realtime Currency Exchange Rate"]["5. Exchange Rate"], 10)
  );
  const ticker =
    coin["Realtime Currency Exchange Rate"]["1. From_Currency Code"];
  // console.log(counter);

  increaseBtn.innerHTML = `<i class="fas fa-arrow-circle-up">Increase Coin</i>
  `;
  increaseBtn.style.color = "yellow";
  removeBtn.innerText = "Delete";
  removeBtn.style.fontSize = "10px";
  spanCurrentUsd.textContent = currentUsd[currentUsd.length - 1];
  spanCurrentUsd.style.color = "#E3B04B";

  //Need this to update the original amount somehow
  increaseBtn.addEventListener("click", (event) => {
    for (let element of currentUsd) {
      element += currentUsd[currentUsd.length - 1];
      currentUsd.push(element);
      // console.log("this is last value:", currentUsd[currentUsd.length - 1].value);
      // console.log("this is array:", currentUsd);
      p.textContent = `${ticker}  $ ${spanCurrentUsd}`;
      return;
    }
  });
  p.append(spanCurrentUsd);
  p.textContent = `${ticker} $`;
  // p.textContent = ticker + "  $" + currentUsd[currentUsd.length - 1];
  coinDiv.append(increaseBtn, p, spanCurrentUsd, removeBtn);
  parentCoinDiv.append(coinDiv);

  //remove the coin
  removeBtn.addEventListener("click", (event) => {
    event.target.parentNode.remove();
  });
}

function getWeeklyValue(coinValue, dropValue) {
  // var request = require("request");
  var url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_WEEKLY&symbol=${coinValue}&market=USD&apikey=B3BGRQPX1AOZLTLP`;
  //https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_WEEKLY&symbol=BTC&market=CNY&apikey=demo
  // request.get(
  fetch(url, {
    url: url,
    json: true,
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      renderWeeklyObj(data, dropValue);
    })
    .catch((err) => {
      console.log(err.message);
      alert("API Weekly has reached max use.");
      return;
    });
}

function renderWeeklyObj(coinWeekly, dropValue) {
  const span = document.createElement("span");
  const divP = coinDiv.querySelectorAll("p");

  const date = new Date();
  dateFull =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    ("0" + date.getDate()).slice(-2);
  // console.log("this is date",dateFull);
  let currentWeeklyUsd = [];
  const week1 = Object.keys(coinWeekly[Object.keys(coinWeekly)[1]])[1];
  const week2 = Object.keys(coinWeekly[Object.keys(coinWeekly)[1]])[2];
  const week3 = Object.keys(coinWeekly[Object.keys(coinWeekly)[1]])[3];
  const week4 = Object.keys(coinWeekly[Object.keys(coinWeekly)[1]])[4];

  if (dropValue === "1 week ago") {
    currentWeeklyUsd.push(
      coinWeekly["Time Series (Digital Currency Weekly)"][`${week1}`][
        "4a. close (USD)"
      ]
    );
   
      span.textContent = currentWeeklyUsd[0];
      divP[divP.length - 1].append(`   Week of ${week1}:   $`, span);
    
  } else if (dropValue === "2 weeks ago") {
    currentWeeklyUsd.push(
      coinWeekly["Time Series (Digital Currency Weekly)"][`${week2}`][
        "4a. close (USD)"
      ]
    );
    
      span.textContent = currentWeeklyUsd[0];
      divP[divP.length - 1].append(`   Week of ${week2}:   $`, span);
    
  } else if (dropValue === "3 weeks ago") {
    currentWeeklyUsd.push(
      coinWeekly["Time Series (Digital Currency Weekly)"][`${week3}`][
        "4a. close (USD)"
      ]
    );
    
      span.textContent = currentWeeklyUsd[0];
      divP[divP.length - 1].append(`   Week of ${week3}:   $`, span);
   
  } else if (dropValue === "4 weeks ago") {
    currentWeeklyUsd.push(
      coinWeekly["Time Series (Digital Currency Weekly)"][`${week4}`][
        "4a. close (USD)"
      ]
    );
   
      span.textContent = currentWeeklyUsd[0];
      divP[divP.length - 1].append(`   Week of ${week4}:    $`, span);
    
  } else {
    console.log("No week Error");
  }
}
function renderDropdown(weeklyObj) {
  const weeksDrop = document.querySelectorAll(".weeks");
  console.log(weeksDrop);
  for (let i = 0; i < weeksDrop.length; i++) {
    weeksDrop[i].innerText = `Week ${i}`;
  }
}
