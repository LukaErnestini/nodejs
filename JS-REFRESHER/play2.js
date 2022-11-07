const person = {
  name: "Max",
  age: 29,
  greet() {
    console.log("Hi, I am " + this.name);
  },
};

// Object destructuring
const printName = ({ name }) => {
  console.log(name);
};

printName(person);

const { name, age } = person;
console.log(name, age);

// // when we store an array in a constant 'hobbies' we can still edit it,
// // because hobbies is a refference to the array. It doesn't change
const hobbies = ["Sports", "Cooking"];
const [item1, item2] = hobbies;
console.log(item1, item2);
// // for (let hobby of hobbies) {
// //   console.log(hobby);
// // }
// // console.log(hobbies.map((hobby) => "Hobby: " + hobby));
// // console.log(hobbies);

// // hobbies.push("Programming");

// // spread operator (...) pulls every element/property out
// const coopiedArray = [...hobbies];
// console.log(coopiedArray);

// // rest operator (...): creates and array. Merges arguments into array.
// // Same notation, but called differently,
// // depending on what way we use it
// const toArray = (...args) => {
//   return args;
// };

// console.log(toArray(1, 2, 3));
