import shipUpdate from "./shipControl.js";
import Background from "./bgControl.js";

export const HEIGHT = 720;
export const WIDTH = 1280;

// Create the application helper and add its render target to the page

let app = new PIXI.Application({ width: WIDTH, height: HEIGHT });

document.body.appendChild(app.view);

// Create the sprite and add it to the stage
let ship = PIXI.Sprite.from('swordfish.png');
ship.anchor.set(0, 1);
ship.scale.set(0.2, 0.2);
ship.position.set(50, HEIGHT/2);

app.loader.baseUrl = "./assets";
app.loader.add("bg_back", "background/back.png");
app.loader.add("bg_mid", "background/middle.png");
app.loader.add("bg_front", "background/front.png");
app.loader.add("bg", "background/star_field.png");
app.loader.onComplete.add(initLevel);
app.loader.load();

function creatTiling (texture) {
    let tiling = new PIXI.TilingSprite(texture, WIDTH, HEIGHT);
    let s = HEIGHT / texture.height;
    tiling.tileScale.set(s,s)
    tiling.position.set(0, 0);
    app.stage.addChild(tiling);
    return tiling;
}

function checkIntersect(a, b)
{
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function initLevel () {

    let give_power = false;

    document.addEventListener('mousedown', function(event){
        //console.log("down");
        give_power = true;
    });

    document.addEventListener('mouseup', function(event){
        setTimeout(() => {
            give_power = false;
        }, 0);
    });

    //let bg = creatTiling(app.loader.resources["bg"].texture);
    //let bg_back = creatTiling(app.loader.resources["bg_back"].texture);
    //let bg_mid = creatTiling(app.loader.resources["bg_mid"].texture);
    //let bg_front = ;
    const bg_back = new Background(creatTiling(app.loader.resources["bg"].texture), 1);
    const bg_mid = new Background(creatTiling(app.loader.resources["bg_mid"].texture), 10);
    //const bg_front = new Background(creatTiling(app.loader.resources["bg_front"].texture), 30);

    app.stage.addChild(ship);

    const fore_ground = new PIXI.Container();
    
    const block = new PIXI.Graphics();
    block.beginFill(0xDE3249);
    for (let i = 0; i < 10; i++) {
        let pos_s = i * 50;
        block.drawRect(pos_s, 0, pos_s + 50, Math.random() * 100);
    }
    block.endFill(); 
    app.stage.addChild(block);

    let elapsed = 0.0;
    app.ticker.add((delta) => {
        elapsed += delta;
        shipUpdate(ship, give_power);
        bg_back.update(give_power);
        bg_mid.update(give_power);
        //bg_front.update(give_power);
    });
}
