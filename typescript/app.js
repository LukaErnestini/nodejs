var num1Inp = document.getElementById("1");
var num2Inp = document.getElementById("2");
var btn = document.querySelector("button");
var p = document.querySelector("p");
function addNums(num1, num2) {
    return num1 + num2;
}
btn === null || btn === void 0 ? void 0 : btn.addEventListener("click", function () {
    var n1 = num1Inp.value;
    var n2 = num2Inp.value;
    var res = addNums(+n1, +n2);
    console.log(res);
});
