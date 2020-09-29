//! import styles
import "../styles/styles.css";
// import p5 from "p5/lib/p5.min.js";
import p5 from "p5/lib/p5.min.js";

import s from "./instance";
new p5(s);

// ! allow hot reloading of the files in project
// if (module.hot) {
//   module.hot.accept();
// }

const cPanel = document.querySelector(".controlpanel");
const handle = document.querySelector(".handle");

cPanel.classList.add("hide");

setTimeout(() => {
  cPanel.classList.remove("hide");

  cPanel.classList.remove("collapse");
  const children = Array.from(cPanel.children);
  children.forEach((child) => child.classList.add("griditem"));
  console.log(children);
}, 500);

handle.addEventListener("click", () => {
  cPanel.classList.toggle("collapse");
});
