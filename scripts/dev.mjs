import chokidar from "chokidar";
import { build } from "./build.mjs";

let queued = false;
let running = false;

async function rebuild(reason) {
  if (running) {
    queued = true;
    return;
  }

  running = true;
  try {
    console.log(`\nRebuilding after ${reason}...`);
    await build();
  } catch (error) {
    console.error(error);
  } finally {
    running = false;
    if (queued) {
      queued = false;
      await rebuild("queued change");
    }
  }
}

await rebuild("initial start");

const watcher = chokidar.watch(["src/**/*.css"], {
  ignoreInitial: true
});

watcher.on("all", (event, filePath) => {
  rebuild(`${event}: ${filePath}`);
});

console.log("Watching src/**/*.css. Press Ctrl+C to stop.");
