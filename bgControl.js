import {HEIGHT, WIDTH} from "./app.js";

export default class Background {
    constructor (bg, m) {
        this.s_base = 0.2 * m;
        this.s_limit = 1 * m;
        this.s = this.s_base;
        this.a = this.s_base / 10;
        this.r_a = this.s_base / 20;
        this.r = 0.6;
        this.bg = bg;
        this.pause = false;
    }
    
    update(accel, brake) {
        if (accel) {
            this.pause = false;
        }
        if (this.pause) {
            return;
        }

        
        if (accel === 1) {
            this.s += this.a;
        }
        else if (accel === -1) {
            this.s -= this.r_a;
        }
        else {
            this.s -= this.r * this.a;
        }

        if (this.s > this.s_limit) {
            this.s = this.s_limit;
        }
        else if (this.s < this.s_base) {
            this.s = this.s_base;
        }
        this.bg.tilePosition.x -= this.s;
    }

    revive () {
        this.s = this.s_base;
        this.pause = true;
    }

    reset() {
        this.bg.tilePosition.x = WIDTH;
    }
};

