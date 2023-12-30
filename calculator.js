const divScreen = document.querySelector(".screen");
const divSmallScreen = document.querySelector(".screenSmall");
const btnsDigits = document.querySelectorAll(".digit");
const btnsOperators = document.querySelectorAll(".operator");
const btnClear = document.querySelector(".clr");
const btnDel = document.querySelector(".del");

let data = {
  // data structure to manipulate and track input and output
  op1: "0",
  sign1: "",
  op2: "",
  sign2: "",
  result: "",
};

let calcDisplay = {
  mainScreen: "",
  secondScreen: "",
};

function initCalc() {
  data["op1"] = "0";
  data["sign1"] = "";
  data["op2"] = "";
  data["sign2"] = "";
  data["result"] = "";

  calcDisplay.mainScreen = "0";
  calcDisplay.secondScreen = "";
  divScreen.textContent = calcDisplay.mainScreen;
  divSmallScreen.textContent = calcDisplay.secondScreen;
}

function updateDisplay(input) {
  const symbols = {
    add: "+",
    subtract: "−",
    multiply: "×",
    divide: "÷",
    equal: "=",
  };

  calcDisplay.mainScreen = data["sign2"]
    ? `${data["result"] || data["op2"] || data["op1"]}`
    : `${data["op2"] || data["result"] || data["op1"]}`;

  if (data["result"] || data["sign2"] || data["op2"] || data["sign1"]) {
    calcDisplay.secondScreen = data["sign2"]
      ? `${symbols[data["sign2"]]} ${data["op2"]} ${symbols[data["sign1"]]} ${
          data["op1"]
        }`
      : `${symbols[data["sign1"]]} ${data["result"] || data["op1"]}`;
  } else {
    calcDisplay.secondScreen = "";
  }

  divScreen.textContent = calcDisplay.mainScreen;
  divSmallScreen.textContent = calcDisplay.secondScreen;
  console.log(calcDisplay.mainScreen);
  console.log(calcDisplay.secondScreen);
  console.log(data);
}

function enterDigit(digitEl) {
  let digit = digitEl.target.textContent;
  if (data["sign2"] === "equal") {
    // INPUT: X + Y =
    if (data["result"]) {
      data["op1"] = data["op2"];
      data["op2"] = digit;
      data["result"] = "";
      updateDisplay();
    } else {
      data["op2"] += digit;
      updateDisplay();
    }
  } else if (data["sign1"]) {
    // INPUT: X =
    if (data["sign1"] === "equal") {
      data["op1"] = data["op1"] ? data["op1"] + digit : digit;
      updateDisplay();
    } else {
      // INPUT: x (+-*/)
      data["op2"] =
        data["op2"] && data["op2"] !== "0" ? data["op2"] + digit : digit;
      updateDisplay();
    }
  } else if (data["op1"] !== "0") {
    // INPUT: X
    data["op1"] += digit;
    updateDisplay();
  } else {
    // INPUT: blank
    data["op1"] = digit;
    updateDisplay();
  }
}

initCalc();
btnClear.addEventListener("click", initCalc);
btnsDigits.forEach((el) => el.addEventListener("click", enterDigit));
