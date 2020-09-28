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
}, 500);

handle.addEventListener("click", () => {
  cPanel.classList.toggle("collapse");
});
