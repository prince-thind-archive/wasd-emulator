const { mouse, keyboard, Key, screen } = require("@nut-tree/nut-js");
const dialog = require("dialog-node");

keyboard.config.autoDelayMs = 0.1;
let running = true;

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
  const screenWidth = await screen.width();
  const screenHeight = await screen.height();
  dialog.info("Stop", "Edge Flipper", 0, stop);

  while (true) {
    if (!running) break;

    await sleep(0.1);
    const mousePosition = await mouse.getPosition();
    const posX = mousePosition.x;
    const posY = mousePosition.y;
    const percentageX = Math.round(
      100 - ((screenWidth - posX) / screenWidth) * 100
    );
    const percentageY = Math.round(
      100 - ((screenHeight - posY) / screenHeight) * 100
    );

    let pressedKey = null;
    if (percentageX >= 99) {
      pressedKey = "D";
    }
    if (percentageX <= 1) {
      pressedKey = "A";
    }
    if (percentageY >= 99) {
      pressedKey = "S";
    }
    if (percentageY <= 1) {
      pressedKey = "W";
    }

    if (pressedKey) {
      await pressKey(pressedKey);
    } else {
      await keyboard.releaseKey(Key.W);
      await keyboard.releaseKey(Key.S);
      await keyboard.releaseKey(Key.A);
      await keyboard.releaseKey(Key.D);
    }
  }
}

async function pressKey(key) {
  await keyboard.pressKey(Key[key]);
}

function sleep(n) {
  return new Promise((r) => setTimeout(r, n * 1000));
}
