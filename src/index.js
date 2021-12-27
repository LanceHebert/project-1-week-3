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

//B3BGRQPX1AOZLTLP
//6MHEHPP7MI5FPCOG
//2RNKGNY0ABJEY1NF
//GDBQ566T4H3VOIJ5

//Form input event listener. Get Values for Ticker and What drop down value is. Invoke GetAPI function for API call.
//****************************************************************** */
coinInput();
function coinInput() {
  renderDropdown();
  const form = document.querySelector("#formInput");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const coinValue = event.target.tickerInput.value;
      const dropValue = event.target.weekList.value;
      getAPI(coinValue, dropValue);
    });
  }
}
//Fetch Current value of coin with passed Coin value. invoke renderCoin and get weeklyValue functions
//****************************************************************** */
function getAPI(coinValue, dropValue) {
  var url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${coinValue}&to_currency=USD&apikey=2RNKGNY0ABJEY1NF`;
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
//create DOM elements, get coin value to render current price creating structure of divs.
//****************************************************************** */
function renderCoinObj(coin) {
  //variable creation for DOM elements
  const parentCoinDiv = document.querySelector("#coins");
  const p = document.createElement("p");
  const removeBtn = document.createElement("button");
  const increaseBtn = document.createElement("button");
  const emptyDiv = document.createElement("div");
  const decreaseBtn = document.createElement("button");
  const coinDiv = document.createElement("div");
  const ticker =
    coin["Realtime Currency Exchange Rate"]["1. From_Currency Code"];
  //making current value a float
  let currentUsd = parseFloat(
    coin["Realtime Currency Exchange Rate"]["5. Exchange Rate"],
    10
  );
  let coinCounter = 1;
  //styling of divs
  coinDiv.classList.add("card");
  coinDiv.classList.add("targetThis");
  coinDiv.style.width = "45rem";
  emptyDiv.classList.add("emptyDiv");
  p.classList.add("pClass");
  //adding Icons to buttons
  increaseBtn.innerHTML = `<i class="fas fa-arrow-circle-up">Increase Coin</i>
   `;
  decreaseBtn.innerHTML = `<i class="fas fa-arrow-circle-down">Decrease Coin</i>
   `;
  removeBtn.innerText = "Delete";
  //event listener for increase button
  increaseBtn.addEventListener("click", (event) => {
    coinCounter++;
    let totalUsd = currentUsd * coinCounter;
    console.log("this is array:", currentUsd);
    p.innerHTML = `${coinCounter} ${ticker} Coin(s) $ <span>${totalUsd}<br></span>`;
  });
  //event listener for decrease button
  decreaseBtn.addEventListener("click", (e) => {
    let totalSubUsd = currentUsd * coinCounter;
    coinCounter = coinCounter - 1;
    totalSubUsd = totalSubUsd - currentUsd;
    p.innerHTML = `${coinCounter} ${ticker} Coin(s) $ <span>${totalSubUsd}<br></span>`;
  });
  //remove button event listener
  removeBtn.addEventListener("click", (event) => {
    const divIndex = document.querySelectorAll(".targetThis");
    const deltaDivIndex = document.querySelectorAll("#delta div");
    const divIndexArray = Array.from(divIndex);
    //removing both div clicked on and its equivalent div on right side through index number matching.
    divIndexArray.forEach((div) => {
      if (event.target.parentNode === div) {
        const indexNumber = divIndexArray.indexOf(div);
        console.log(deltaDivIndex[indexNumber]);
        deltaDivIndex[indexNumber].remove();
      } else {
        console.log("Nothing is here or you messed up");
        event.target.parentNode.remove();
      }
    });
    event.target.parentNode.remove();
  });
  //final display with appending
  p.innerHTML = `${coinCounter} ${ticker} Coin(s) $ <span>${currentUsd}<br></span>`;
  coinDiv.append(increaseBtn, decreaseBtn, p, emptyDiv, removeBtn);
  parentCoinDiv.append(coinDiv);
}
// fetch call for weekly values to display
//****************************************************************** */
function getWeeklyValue(coinValue, dropValue) {
  var url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_WEEKLY&symbol=${coinValue}&market=USD&apikey=2RNKGNY0ABJEY1NF`;
  fetch(url, {
    url: url,
    json: true,
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      renderWeeklyObj(data, dropValue);
      renderDelta(coinValue, dropValue);
      renderVerdict();
    })
    .catch((err) => {
      console.log(err.message);
      console.log("API Weekly has an Error", console.log(err.message));
      alert("API LIMIT REACHED-- REFRESH PAGE AND TRY AGAIN");
    });
}
//handling all weekly value content
//****************************************************************** */
function renderWeeklyObj(coinWeekly, dropValue) {
  const span = document.createElement("span");
  const divWeekly = document.querySelectorAll(".emptyDiv");
  const week1 = Object.keys(coinWeekly[Object.keys(coinWeekly)[1]])[1];
  const week2 = Object.keys(coinWeekly[Object.keys(coinWeekly)[1]])[2];
  const week3 = Object.keys(coinWeekly[Object.keys(coinWeekly)[1]])[3];
  const week4 = Object.keys(coinWeekly[Object.keys(coinWeekly)[1]])[4];

  const date = new Date();
  let currentWeeklyUsd = [];
  dateFull =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    ("0" + date.getDate()).slice(-2);
  //else if statements to determine what value is passed for the week. This area could be cleaned up to be something more dynamic
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
//making the drop down dynamic for 4 entries.
//****************************************************************** */
function renderDropdown(weeklyObj) {
  const weeksDrop = document.querySelectorAll(".weeks");
  console.log(weeksDrop);
  for (let i = 0; i < weeksDrop.length; i++) {
    weeksDrop[i].innerText = `Week ${i}`;
  }
}
//rendering right sided divs with delta percent
//****************************************************************** */
function renderDelta(ticker, week) {
  const deltaDiv = document.createElement("div");
  const parentDeltaDiv = document.querySelector("#delta");
  const pDelta = document.createElement("p");
  const pSpan = document.createElement("span");
  const coinDivId = document.querySelector("#coins");
  const currentValueSelected = coinDivId.querySelectorAll("span");
  const weeklyValueSelected = coinDivId.querySelectorAll("span");
  const pPercent = document.createElement("span");
  let currentValue = parseFloat(
    currentValueSelected[currentValueSelected.length - 2].textContent
  );
  let weeklyValue = parseFloat(
    weeklyValueSelected[weeklyValueSelected.length - 1].textContent
  );
  let deltaChange = (currentValue / weeklyValue) * 100 - 100;

  pPercent.textContent = "%";
  pDelta.textContent = `The difference between ${ticker.toUpperCase()} today and ${week} is `;
  pSpan.textContent = deltaChange;
  deltaDiv.classList.add("card");
  deltaDiv.style.width = "45rem";
  deltaDiv.style.height = "320px";
  deltaDiv.style.fontSize = "2rem";
  deltaDiv.style.padding = "125px,0px";
  deltaDiv.style.textAlign = "center";
  deltaDiv.style.paddingTop = "10%";

  pDelta.append(pSpan, pPercent);
  deltaDiv.append(pDelta);
  parentDeltaDiv.append(deltaDiv);
}
//Render bottom verdict only after 2 entries have been made
//****************************************************************** */
function renderVerdict() {
  const divVerdict = document.createElement("div");
  const pVerdict = document.createElement("p");
  const spanVerdict = document.createElement("span");
  const parentVerdictDiv = document.querySelector("#verdict");
  const deltaParentDiv = document.querySelector("#delta");
  const deltaSpans = deltaParentDiv.querySelectorAll("span");
  let kingSpan = -9999999999;
  let splitArray = [];
  //Finding which delta percent is greater by storing value and iterating through and replacing if greater
  deltaSpans.forEach((span) => {
    console.log("inside foreach", typeof span.textContent);
    if (parseFloat(span.textContent) > kingSpan) {
      kingSpan = parseFloat(span.textContent);
      splitArray = span.parentNode.innerText.split(" ");
      console.log("THIS IS IT", splitArray);
    } else if (parseFloat(span.textContent) === kingSpan) {
      kingSpan = "no one, it is a tie.";
    } else {
      console.log("Not better than the king");
    }
  });
  if (deltaSpans.length > 2 && deltaSpans.length <= 4) {
    spanVerdict.textContent = kingSpan;
    pVerdict.innerHTML = `Out of these coins,<span> ${splitArray[3].toUpperCase()} </span> was the best investment ${
      splitArray[6]
    } ${splitArray[7]} ${splitArray[8]}  with a gain of <span>${
      spanVerdict.textContent
    }%</span>`;
    parentVerdictDiv.parentNode.style.height = "200px";
    divVerdict.append(pVerdict);
    parentVerdictDiv.append(divVerdict);
  } else if (deltaSpans.length > 4) {
    p.parentNode.remove();
    spanVerdict.textContent = kingSpan;
    pVerdict.textContent = `Out of these coins,  ${spanVerdict.textContent}`;
    parentVerdictDiv.parentNode.style.height = "200px";
    divVerdict.append(pVerdict);
    parentVerdictDiv.append(divVerdict);
  }
}
