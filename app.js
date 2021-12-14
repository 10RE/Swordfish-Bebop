import Ship from "./shipControl.js";
import Background from "./bgControl.js";
import Bumper from "./bpControl.js";
//import Bonus from "./bonusControl.js";

export const HEIGHT = 720;
export const WIDTH = 1280;

// Create the application helper and add its render target to the page

let app = new PIXI.Application({ width: WIDTH, height: HEIGHT });

document.body.appendChild(app.view);

// Create the sprite and add it to the stage
let ship_spr = PIXI.Sprite.from('./assets/swordfish.png');
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

let fuel_disp = new PIXI.Text('Fuel left: ',{fontFamily : 'Arial', fontSize: 24, fill: 0xFFFFFF, align: "right"});
fuel_disp.anchor.set(1, 0);
fuel_disp.position.set(WIDTH - 10, 10);

let hp_disp = new PIXI.Text('Hp: ',{fontFamily : 'Arial', fontSize: 24, fill: 0xFFFFFF, align: "left"});
hp_disp.anchor.set(0, 0);
hp_disp.position.set(10, 10);

let gameover_disp = new PIXI.Text('See you Space Cowboy', {fontFamily : 'Arial', fontSize: 40, fill: 0xFFFFFF, align: "center", fontWeight: "bold", fontStyle: "italic"});
gameover_disp.anchor.set(0.5, 0.5);
gameover_disp.position.set(WIDTH / 2, HEIGHT / 2);

let gameover_background = new PIXI.Graphics();
gameover_background.beginFill(0);
gameover_background.drawRect(0, 0, WIDTH, HEIGHT);
gameover_background.endFill();
gameover_background.pivot.set(0, 0);
gameover_background.position.set(0, 0);
gameover_background.alpha = 0.7;

let try_again_btn_bg = new PIXI.Graphics();
try_again_btn_bg.beginFill(0x0000FF);
try_again_btn_bg.drawRoundedRect(-100, -30, 200, 60, 15);
try_again_btn_bg.endFill();
try_again_btn_bg.pivot.set(0.5, 0.5);

let try_again_btn_text = new PIXI.Text('Try again', {fontFamily : 'Arial', fontSize: 30, fill: 0xFFFFFF, align: "center"});
try_again_btn_text.anchor.set(0.5, 0.5);
//try_again_btn_text.position.set( / 2, HEIGHT / 2);

let try_again_btn = new PIXI.Container();
try_again_btn.addChild(try_again_btn_bg, try_again_btn_text);
try_again_btn.position.set(WIDTH / 2, HEIGHT / 2 + 100);

let gameover_screen = new PIXI.Container();
gameover_screen.addChild(gameover_background);
gameover_screen.addChild(gameover_disp);
gameover_screen.addChild(try_again_btn);


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

const hp_max = 3;

function initLevel () {

    let accel = 0;
    let hp = hp_max;

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

    try_again_btn.interactive = true;
    try_again_btn.on("mousedown", resetGame);
    function resetGame () {
        console.log("Clicked");
        ship.reset();
        bg_back.reset();
        bg_mid.reset();
        bumper.reset();
        console.log(app.stage.children);
        app.stage.removeChildAt(app.stage.children.length - 1);
        console.log(app.stage.children);
        hp = hp_max;
        app.ticker.start();
    }
    


    app.stage.addChild(ship_con);
    app.stage.addChild(fuel_disp);
    app.stage.addChild(hp_disp);
    gameover_screen.visible = false;

    const bumper = new Bumper(app, 30);
    //const bonus = new Bonus(app, bumper.getHeights(), 30);

    let elapsed = 0.0;
    app.ticker.add((delta) => {
        elapsed += delta;
        
        bg_back.update(accel);
        bg_mid.update(accel);
        let bumper_height, bonus_height;
        [bumper_height, bonus_height] = bumper.update(accel);
        let bumper_collision = ship.checkBumperCollision(bumper_height);
        if (bumper_collision) {
            //console.log("Hit");
            ship.revive();
            bg_back.revive();
            bg_mid.revive();
            bumper.revive();
            hp --;
        }
        else {
            ship.update(accel);
        }
        let bonus_collision = ship.checkBumperCollision(bonus_height);
        if (bonus_collision) {
            console.log("Bonus");
            ship.addFuel(10);
        }

        if (ship.getFuel() < 0) {
            hp = 0;
        }

        if (hp === 0) {
            app.ticker.stop();
            app.stage.addChild(gameover_screen);
            gameover_screen.visible = true;
        }


        //let bonus_heights = bonus.update(accel);

        fuel_disp.text = "Fuel left: " + ship.getFuel().toFixed(2);
        hp_disp.text = "Hp: " + hp;
        //bg_front.update(accel);
    });
}
