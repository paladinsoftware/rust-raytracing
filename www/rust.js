import { Vector, Scene, Camera, Color, SceneObject, ObjectType, Ray } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

let s = new Scene();

const canvas = document.getElementById("game");
canvas.width = 640;
canvas.height = 480;
const ctx = canvas.getContext('2d');
let data = ctx.getImageData(0, 0, 640, 480);

var lastTick;

var fps = document.getElementById('fps');

function render() {
  s.render();

  const cellsPtr = s.pixels();
  const cells = new Uint8Array(memory.buffer, cellsPtr, 3 * 640 * 480);

  let idx = 0;
  let count = cells.length;
  let row = 0;
  let col = 0;

  while (idx < 640 * 480) {
    data.data[idx * 4 + 0] = cells[idx * 3 + 0];
    data.data[idx * 4 + 1] = cells[(idx * 3) + 1];
    data.data[idx * 4 + 2] = cells[(idx * 3) + 2];
    data.data[idx * 4 + 3] = 255;

    idx++;
  }

  ctx.putImageData(data, 0, 0);

  requestAnimationFrame(render);

  if (lastTick) {
    fps.textContent = 1000 / (Date.now() - lastTick) + ' FPS';
  }

  lastTick = Date.now();
}

render();
