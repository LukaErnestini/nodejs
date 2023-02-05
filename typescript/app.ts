const num1Inp = document.getElementById("1") as HTMLInputElement;
const num2Inp = document.getElementById("2") as HTMLInputElement;
const btn = document.querySelector("button");
const p = document.querySelector("p");

function addNums(num1: number, num2: number) {
  return num1 + num2;
}

btn?.addEventListener("click", () => {
  const n1 = num1Inp.value;
  const n2 = num2Inp.value;
  const res = addNums(+n1, +n2);
  console.log(res);
});
