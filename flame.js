
export default class flame {
    constructor () {
        this.flame_core;
        this.initCore();
        this.flame_tail;
        this.initTail();
        
    }

    initCore() {
        this.flame_core = new PIXI.Graphics();
        this.flame_core.beginFill(0xDE3249);
        this.flame_core.drawCircle(0, 0, 50);
        this.flame_core.endFill();
    }

    initTail() {
        this.flame_core = new PIXI.Graphics();
        this.flame_core.beginFill(0xDE3249);
        this.flame_core.drawCircle(0, 0, 50);
        this.flame_core.endFill();
    }

}