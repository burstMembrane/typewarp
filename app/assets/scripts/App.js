//! import styles
import "../styles/styles.css";
// import p5 from "p5/lib/p5.min.js";
import p5 from "p5/lib/p5.min";

import s from "./instance";
new p5(s);

// ! allow hot reloading of the files in project
if (module.hot) {
  module.hot.accept();
}
