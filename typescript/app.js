"use strict";
const num1Inp = document.getElementById("1");
const num2Inp = document.getElementById("2");
const btn = document.querySelector("button");
const p = document.querySelector("p");
const numResults = [];
const strResults = [];
function addNums(num1, num2) {
    if (typeof num1 === "number" && typeof num2 === "number") {
        return num1 + num2;
    }
    else if (typeof num1 === "string" && typeof num2 === "string") {
        return num1 + num2;
    }
    return +num1 + +num2;
}
function printResult(resultObj) {
    console.log(resultObj.val);
}
btn === null || btn === void 0 ? void 0 : btn.addEventListener("click", () => {
    const n1 = num1Inp.value;
    const n2 = num2Inp.value;
    const res = addNums(+n1, +n2);
    numResults.push(res);
    const stringResult = addNums(n1, n2);
    strResults.push(stringResult);
    console.log(res);
    console.log(stringResult);
    printResult({ val: res, timestamp: new Date() });
    console.log(numResults, strResults);
});
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("it worked!");
    }, 1000);
});
myPromise.then((result) => {
    console.log(result.split("w"));
});
