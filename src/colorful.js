import "@fontsource-variable/instrument-sans";
import "./colorful.css";

const blockBrowserZoom = (event) => event.preventDefault();

for (const eventName of ["gesturestart", "gesturechange", "gestureend"]) {
  document.addEventListener(eventName, blockBrowserZoom, { passive: false });
}

document.addEventListener("wheel", (event) => {
  if (event.ctrlKey) event.preventDefault();
}, { passive: false });

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && ["+", "-", "=", "0"].includes(event.key)) event.preventDefault();
});

await import("./main.js");
