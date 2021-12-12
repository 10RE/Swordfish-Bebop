
export default class Background {
    constructor (bg, m) {
        this.s_base = 0.2 * m;
        this.s_limit = 1 * m;
        this.s = this.s_base;
        this.a = this.s_base / 10;
        this.r = 0.6;
        this.bg = bg;
    }
    
    update(give_power) {
        if (this.s > this.s_limit) {
            this.s = this.s_limit;
        }
        else if (give_power) {
            this.s += this.a;
        }
        else if (this.s < this.s_base) {
            this.s = this.s_base;
        }
        else {
            this.s -= this.r * this.a;
        }
        this.bg.tilePosition.x -= this.s;
    }
};

