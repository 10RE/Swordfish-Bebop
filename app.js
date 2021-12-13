import Ship from "./shipControl.js";
import Background from "./bgControl.js";
import Bumper from "./bpControl.js";

export const HEIGHT = 720;
export const WIDTH = 1280;

// Create the application helper and add its render target to the page

let app = new PIXI.Application({ width: WIDTH, height: HEIGHT });

document.body.appendChild(app.view);

// Create the sprite and add it to the stage
let ship_spr = PIXI.Sprite.from('swordfish.png');
ship_spr.anchor.set(0, 1);
ship_spr.scale.set(0.2, 0.2);
ship_spr.position.set(0, 0);
let ship_flame = PIXI.Sprite.from('./assets/flame.png');
ship_flame.anchor.set(1, 1);
ship_flame.scale.set(0.2, 0.2);
ship_flame.position.set(0, -10);
let ship_flame_r = PIXI.Sprite.from('./assets/flame_reverse.png');
ship_flame_r.anchor.set(1, 1);
ship_flame_r.scale.set(0.2, 0.2);
ship_flame_r.position.set(40, -5);
let ship_con = new PIXI.Container();
ship_con.addChild(ship_flame_r);
ship_con.addChild(ship_flame);
ship_con.addChild(ship_spr);
ship_con.position.set(100, HEIGHT/2);
const ship = new Ship(ship_con);


app.loader.baseUrl = "./assets";
app.loader.add("bg_back", "background/back.png");
app.loader.add("bg_mid", "background/middle.png");
app.loader.add("bg_front", "background/front.png");
app.loader.add("bg", "background/star_field.png");
//app.loader.add("flame", "flame.png");
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

function initLevel () {

    let accel = 0;

    document.addEventListener('mousedown', function(event){
        switch (event.button) {
            case 0:
                accel = 1;
                break;
            case 2:
                accel = -1;
                break;
        }
        //console.log("down");
        
    });

    document.addEventListener('mouseup', function(event){
        setTimeout(() => {
            accel = 0;
        }, 0);
    });

    //let bg = creatTiling(app.loader.resources["bg"].texture);
    //let bg_back = creatTiling(app.loader.resources["bg_back"].texture);
    //let bg_mid = creatTiling(app.loader.resources["bg_mid"].texture);
    //let bg_front = ;
    const bg_back = new Background(creatTiling(app.loader.resources["bg"].texture), 1);
    const bg_mid = new Background(creatTiling(app.loader.resources["bg_mid"].texture), 10);
    //const bg_front = new Background(creatTiling(app.loader.resources["bg_front"].texture), 30);

    app.stage.addChild(ship_con);

    const bumper = new Bumper(app, 30);

    let elapsed = 0.0;
    app.ticker.add((delta) => {
        elapsed += delta;
        
        bg_back.update(accel);
        bg_mid.update(accel);
        let bumper_heights = bumper.update(accel);
        let bumper_collision = ship.checkBumperCollision(bumper_heights);
        if (bumper_collision) {
            console.log("Hit");
            ship.reset();
            bg_back.reset();
            bg_mid.reset();
            bumper.reset();
        }
        else {
            ship.update(accel);
        }

        //bg_front.update(accel);
    });
}
