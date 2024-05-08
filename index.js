const dialog = require("dialog-node");
const executeCommand = require("./command.js");

let running = true;
let pressed = false;

dialog.question("Start", "Edge ScrollOver", 0, start);

function start(code) {
  if (code == 0) {
    running = true;
    main();
  }
}

function stop() {
  running = false;
  dialog.question("Restart", "Edge Flipper", 0, start);
}

async function main() {
  const screenWidth = 1366;
  const screenHeight = 768;
  dialog.info("Stop", "Edge Flipper", 0, stop);

  while (true) {
    if (!running) break;

    await sleep(0.1);

    const posX = +(await executeCommand(
      `xdotool getmouselocation --shell | grep X | cut -d "=" -f2`
    ));
    const posY = +(await executeCommand(
      `xdotool getmouselocation --shell | grep Y | cut -d "=" -f2`
    ));

    const percentageX = Math.round(
      100 - ((screenWidth - posX) / screenHeight) * 100
    );
    const percentageY = Math.round(
      100 - ((screenHeight - posY) / screenHeight) * 100
    );

    let pressedKey = null;
    if (percentageX >= 99) {
      pressedKey = "d";
    }
    if (percentageX <= 1) {
      pressedKey = "a";
    }
    if (percentageY >= 99) {
      pressedKey = "s";
    }
    if (percentageY <= 1) {
      pressedKey = "w";
    }

    if (pressedKey && !pressed) {
      await pressKey(pressedKey);
      pressed = true;
    } else {
      await executeCommand(`xdotool keyup --clearmodifiers a`);
      await executeCommand(`xdotool keyup --clearmodifiers w`);
      await executeCommand(`xdotool keyup --clearmodifiers s`);
      await executeCommand(`xdotool keyup --clearmodifiers d`);
      pressed = false;
    }
  }
}

async function pressKey(key) {
  await executeCommand(`xdotool keydown ${key}`);
}

function sleep(n) {
  return new Promise((r) => setTimeout(r, n * 1000));
}
