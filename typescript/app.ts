const num1Inp = document.getElementById("1") as HTMLInputElement;
const num2Inp = document.getElementById("2") as HTMLInputElement;
const btn = document.querySelector("button");
const p = document.querySelector("p");

const numResults: Array<number> = [];
const strResults: string[] = [];

type Numstr = number | string;
type Result = { val: number; timestamp: Date }; //option1

interface ResultObj {
  //option2
  val: number;
  timestamp: Date;
}

function addNums(num1: Numstr, num2: Numstr) {
  if (typeof num1 === "number" && typeof num2 === "number") {
    return num1 + num2;
  } else if (typeof num1 === "string" && typeof num2 === "string") {
    return num1 + num2;
  }
  return +num1 + +num2;
}

function printResult(resultObj: ResultObj) {
  console.log(resultObj.val);
}

btn?.addEventListener("click", () => {
  const n1 = num1Inp.value;
  const n2 = num2Inp.value;
  const res = addNums(+n1, +n2);
  numResults.push(res as number);
  const stringResult = addNums(n1, n2);
  strResults.push(stringResult as string);
  console.log(res);
  console.log(stringResult);
  printResult({ val: res as number, timestamp: new Date() });
  console.log(numResults, strResults);
});

const myPromise = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    resolve("it worked!");
  }, 1000);
});

myPromise.then((result) => {
  console.log(result.split("w"));
});
