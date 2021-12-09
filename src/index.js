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
//****************************************************************** */
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
//****************************************************************** */
function getAPI(coinValue, dropValue) {
  // var request = require("request");
  var url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${coinValue}&to_currency=USD&apikey=6MHEHPP7MI5FPCOG`;
  // request.get(
  fetch(url, {
    url: url,
    json: true,
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      renderCoinObj(data);
      getWeeklyValue(coinValue, dropValue);
      
    })
    .catch((err) => {
      console.log(err.message);
      console.log("API Current has an Error.");
    });
}

//show the coin chosen

const coinDiv = document.createElement("div");
//****************************************************************** */
function renderCoinObj(coin) {
  const firstCoinDiv = document.createElement("div");
  const parentCoinDiv = document.querySelector("#coins");
  const p = document.createElement("p");
  const removeBtn = document.createElement("button");
  const increaseBtn = document.createElement("button");
  const spanCurrent = document.createElement("span");
  const emptyDiv = document.createElement("div");
  const decreaseBtn = document.createElement("button");
  let coinCounter = 1;
  

  p.classList.add("pClass");
  let currentUsd = [];
  currentUsd.push(
    parseFloat(coin["Realtime Currency Exchange Rate"]["5. Exchange Rate"],10)
  );
  // let counter = 1;
  emptyDiv.classList.add("emptyDiv");
  const ticker =
    coin["Realtime Currency Exchange Rate"]["1. From_Currency Code"];
  // console.log(counter);

  increaseBtn.innerHTML = `<i class="fas fa-arrow-circle-up">Increase Coin</i>
   `;  
  increaseBtn.style.color = "yellow";
  decreaseBtn.style.color = "yellow";
  decreaseBtn.innerHTML = `<i class="fas fa-arrow-circle-up">Increase Coin</i>
   `;
  removeBtn.innerText = "Delete";
  removeBtn.style.fontSize = "10px";

  //Need this to update the original amount somehow
  increaseBtn.addEventListener("click", function something(event){
    for (let element of currentUsd) {
      element += currentUsd[currentUsd.length - 1];
      coinCounter++;
      currentUsd.push(element);
      console.log("this is last value:", currentUsd[currentUsd.length - 1]);
      console.log("this is array:", currentUsd);
      p.innerHTML = `${coinCounter} ${ticker} Coin(s) $ <span>${
        currentUsd[currentUsd.length - 1]
      }<br></span>`;
      return;
    }
  });
  decreaseBtn.addEventListener("click",(e)=>{
    decreaseCoin(currentUsd,p,coinCounter,ticker)
  })



  spanCurrent.textContent = `${currentUsd[currentUsd.length - 1]}`;

  p.innerHTML = `${coinCounter} ${ticker} Coin(s) $ <span>${
    currentUsd[currentUsd.length - 1]
  }<br></span>`;

  // p.textContent = ticker + "  $" + currentUsd[currentUsd.length - 1];
  firstCoinDiv.append(increaseBtn,decreaseBtn, p, emptyDiv, removeBtn);
  coinDiv.append(firstCoinDiv);
  parentCoinDiv.append(coinDiv);

  //remove the coin
  removeBtn.addEventListener("click", (event) => {
    event.target.parentNode.remove();
  });
}

function decreaseCoin(currentUsd,p,coinCounter,ticker){
  
  console.log("HERE I AM ********",currentUsd);
  
  for (let element of currentUsd) {
    // [currentUsd.length - 1] -= currentUsd[0]
    --coinCounter;    
    currentUsd.pop(currentUsd);
    console.log("this is last value:", currentUsd[currentUsd.length - 1]);
    console.log("this is array:", currentUsd);
    p.innerHTML = `${coinCounter} ${ticker} Coin(s) $ <span>${
      currentUsd[currentUsd.length - 1]
    }<br></span>`;
    
  }
}


//****************************************************************** */
function getWeeklyValue(coinValue, dropValue) {
  // var request = require("request");
  var url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_WEEKLY&symbol=${coinValue}&market=USD&apikey=6MHEHPP7MI5FPCOG`;
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
      renderDelta(coinValue,dropValue);
    })
    .catch((err) => {
      console.log(err.message);
      console.log("API Weekly has an Error");
    });
}
//****************************************************************** */
function renderWeeklyObj(coinWeekly, dropValue) {
  const span = document.createElement("span");
  const divP = coinDiv.querySelector("p");
  const divWeekly = document.querySelectorAll(".emptyDiv");

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
    divWeekly[divWeekly.length - 1].append(
      `   Week ending ${week1}:   $  `,
      span
    );
    // divP.append(pWeekly);
  } else if (dropValue === "2 weeks ago") {
    currentWeeklyUsd.push(
      coinWeekly["Time Series (Digital Currency Weekly)"][`${week2}`][
        "4a. close (USD)"
      ]
    );

    span.textContent = currentWeeklyUsd[0];
    divWeekly[divWeekly.length - 1].append(
      `   Week ending ${week2}:   $  `,
      span
    );
  } else if (dropValue === "3 weeks ago") {
    currentWeeklyUsd.push(
      coinWeekly["Time Series (Digital Currency Weekly)"][`${week3}`][
        "4a. close (USD)"
      ]
    );

    span.textContent = currentWeeklyUsd[0];
    divWeekly[divWeekly.length - 1].append(
      `   Week ending ${week3}:   $  `,
      span
    );
  } else if (dropValue === "4 weeks ago") {
    currentWeeklyUsd.push(
      coinWeekly["Time Series (Digital Currency Weekly)"][`${week4}`][
        "4a. close (USD)"
      ]
    );

    span.textContent = currentWeeklyUsd[0];
    divWeekly[divWeekly.length - 1].append(
      `   Week ending ${week4}:    $  `,
      span
    );
  } else {
    console.log("No week Error");
  }
}
//****************************************************************** */
function renderDropdown(weeklyObj) {
  const weeksDrop = document.querySelectorAll(".weeks");
  console.log(weeksDrop);
  for (let i = 0; i < weeksDrop.length; i++) {
    weeksDrop[i].innerText = `Week ${i}`;
  }
}

function renderDelta(ticker,week){
  const deltaDiv = document.createElement("div")
  const parentDeltaDiv = document.querySelector("#delta");
  const pDelta = document.createElement("p");
  const pSpan = document.createElement("span");
  const currentValueSelected = coinDiv.querySelectorAll("span")
  const weeklyValueSelected = coinDiv.querySelectorAll("span")

   let currentValue = parseFloat(currentValueSelected[currentValueSelected.length-2].textContent)
  let weeklyValue = parseFloat(weeklyValueSelected[weeklyValueSelected.length-1].textContent)

  let deltaChange = ((currentValue/ weeklyValue) * 100) - 100;
  
  pDelta.textContent = `The difference between ${ticker} today and ${week} is `
  pSpan.textContent = ` ${deltaChange} %`;

  pDelta.append(pSpan)
  deltaDiv.append(pDelta);
  parentDeltaDiv.append(deltaDiv);
  

}
