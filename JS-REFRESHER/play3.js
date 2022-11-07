const fetchData = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Done!");
    }, 1500);
  });
  return promise;
};

setTimeout(() => {
  console.log("timer is done");
  fetchData().then((text) => {
    console.log(text);
  });
}, 1);

console.log("hello");
