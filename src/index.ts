import WebcamApp from "./WebcamApp";
import "./styles.css";

const rootElement = document.getElementById("root");
if (rootElement && rootElement instanceof HTMLDivElement) {
  new WebcamApp(rootElement);
}
