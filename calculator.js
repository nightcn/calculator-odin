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

function calc(a, op, b) {
  const calculator = {
    add: (a, b) => +a + +b,
    divide: (a, b) => +a / +b,
    multiply: (a, b) => +a * +b,
    subtract: (a, b) => +a - +b,
  };

  return Number.isNaN(calculator[op](a, b))
    ? "0"
    : calculator[op](a, b).toString();
}

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
    // data structure to replace math verbs to actual operator symbols
    add: "+",
    subtract: "−",
    multiply: "×",
    divide: "÷",
    equal: "=",
  };

  //                -- Changes in calcDisplay --
  // GIVEN STATE => op1: X , sign1; NO, op2: NO, sign2: NO, result: NO
  // OUTPUT => mainScreen: X, secondScreen: blank
  //
  // GIVEN STATE => op1: X, sign1: +-/*=, op2: NO, sign2: NO, result: NO
  // OUTPUT => mainScreen: X, secondScreen : X +-/*=
  //
  // GIVEN STATE => op1: X, sign1: +-*/, op2: Y, sign2: NO, result: NO
  // OUTPUT => mainScreen: Y, secondScreen: X =-/*
  //
  // GIVEN STATE => op1: X, sign1: +-/*, op2: Y, sign2: +-/*, result: Z
  // OUTPUT => mainScreen: Z, secondScreen: Z +-*/
  //
  // GIVEN STATE => op1: X, sign1: +-/*, op2: Y, sign2: =, result: Z
  // OUTPUT => mainScreen: Z, secondScreen: X +-/* Y =

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
    // STATE: X + Y = Z
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
    if (data["sign1"] === "equal") {
      // STATE: X =
      data["op1"] = data["op1"] ? data["op1"] + digit : digit;
      updateDisplay();
    } else {
      // STATE: x +-*/
      data["op2"] =
        data["op2"] && data["op2"] !== "0" ? data["op2"] + digit : digit;
      updateDisplay();
    }
  } else if (data["op1"] !== "0") {
    // STATE: X
    data["op1"] += digit;
    updateDisplay();
  } else {
    // STATE: blank
    data["op1"] = digit;
    updateDisplay();
  }
}

function enterOperator(operatorEl) {
  let operator = operatorEl.target.getAttribute("name");

  if (operator === "equal") {
    // INPUT: X + "" (=) || X + Y (=)
    if (data["sign1"] && data["sign1"] !== "equal") {
      // mimc the default behavior of a calculator if '=' pressed multiple times when inputs are given
      data["op1"] = data["result"] || data["op1"];
      data["op2"] = data["op2"] || data["op1"];
      data["sign2"] = "equal";
      data["result"] = calc(data["op1"], data["sign1"], data["op2"]);
      updateDisplay();
    } else {
      // INPUT: X(=)
      data["sign1"] =
        data["sign1"] && data["sign1"] === "equal" ? "" : operator;
      data["op1"] = data["sign1"] === "equal" ? data["op1"] : "0";
      updateDisplay(); // the above 2 lines: reset the input when "=" pressed multiple times without any second operand
    }
  } else {
    if (data["sign2"] === "equal") {
      // INPUT: X + Y = Z (+-/*)
      data["op1"] = data["result"];
      data["sign1"] = operator;
      data["op2"] = "";
      data["sign2"] = "";
      data["result"] = "";
      updateDisplay();
    } else if (data["sign1"] !== "equal" && data["op2"]) {
      // INPUT: X + Y (+-/*)
      data["result"] = calc(data["op1"], data["sign1"], data["op2"]);
      data["op1"] = data["result"] ? data["result"] : data["op1"];
      data["sign1"] = operator;
      data["op2"] = "";
      data["sign2"] = "";
      updateDisplay();
    } else {
      // INPUT: X (+-/*)
      data["sign1"] = operator;
      updateDisplay();
    }
  }
}

initCalc();
btnClear.addEventListener("click", initCalc);
btnsDigits.forEach((el) => el.addEventListener("click", enterDigit));
btnsOperators.forEach((el) => el.addEventListener("click", enterOperator));
