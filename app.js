import shipUpdate from "./shipControl.js";

export const HEIGHT = 720;
export const WIDTH = 1280;

// Create the application helper and add its render target to the page

let app = new PIXI.Application({ width: WIDTH, height: HEIGHT });

document.body.appendChild(app.view);

// Create the sprite and add it to the stage
let sprite = PIXI.Sprite.from('swordfish.png');
sprite.anchor.set(0, 1);
sprite.scale.set(0.2, 0.2);
sprite.position.set(50, HEIGHT/2);
app.stage.addChild(sprite);

// Add a ticker callback to move the sprite back and forth

let givePower = false;

document.addEventListener('mousedown', function(event){
    console.log("down");
    givePower = true;
});

document.addEventListener('mouseup', function(event){
    setTimeout(() => {
        givePower = false;
    }, 100);
});

let elapsed = 0.0;
app.ticker.add((delta) => {
    elapsed += delta;
    //sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
    shipUpdate(sprite, givePower);
});