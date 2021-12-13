import {HEIGHT, WIDTH} from "./app.js";

export default class Bumper {
    constructor (app, m) {
        this.s_base = 0.2 * m;
        this.s_limit = 1 * m;
        this.s = this.s_base;
        this.a = this.s_base / 10;
        this.r_a = this.s_base / 20;
        this.r = 0.4;
        this.app = app;
        /*
        this.prev_fore_ground = new PIXI.Container();
        this.cur_fore_ground = new PIXI.Container();
        this.next_fore_ground = new PIXI.Container();
        this.passed_flag = true;
        */
        this.fore_ground = new PIXI.Container();
        this.height_arr;

        this.generate_thres = 80;
        this.bonus_height_arr;
        this.bonus_size = 50;   
        this.bonus_gap = 50;
        this.bonus_ground = new PIXI.Container();

        this.pause = false;
        this.init();
        
    }

    init() {
        /*
        this.addBlockToForeGround(this.prev_fore_ground);
        this.prev_fore_ground.position.x = - WIDTH / 4 * 3;
        this.app.stage.addChild(this.prev_fore_ground);

        this.addBlockToForeGround(this.cur_fore_ground);
        this.cur_fore_ground.position.x = WIDTH / 4;
        this.app.stage.addChild(this.cur_fore_ground);

        this.addBlockToForeGround(this.next_fore_ground);
        this.next_fore_ground.position.x = WIDTH / 4 * 5;
        this.app.stage.addChild(this.next_fore_ground);
        */

        this.addBlock(30 * WIDTH);
        this.fore_ground.position.x = WIDTH;
        this.app.stage.addChild(this.fore_ground);
        this.bonus_ground.position.x = WIDTH;
        this.app.stage.addChild(this.bonus_ground);
    }

    addBlock(total_width = 10 * WIDTH, block_min_width = 100, block_width_diff = 300, block_max_gap = 100, block_max_height = HEIGHT / 3 ) {
        this.height_arr = new Array(total_width).fill(HEIGHT);
        this.bonus_height_arr = new Array(total_width).fill(HEIGHT + 1);
        let pos_s = 0;
        while (pos_s < total_width) {
            const block = new PIXI.Graphics();
            block.beginFill(0xFFFFFF);
            let local_height = Math.random() * block_max_height;
            let local_width = Math.random() * block_width_diff + block_min_width
            pos_s += (local_width + Math.random() * block_max_gap);
            block.drawRect(pos_s - local_width, HEIGHT - local_height, local_width, local_height);
            block.endFill();

            for (let pos = pos_s - local_width; pos < pos_s; pos ++) {
                this.height_arr[Math.round(pos)] = HEIGHT - local_height;
            }

            this.fore_ground.addChild(block);

            if ( Math.random() * 100 > this.generate_thres ) {
                const bonus_block = new PIXI.Graphics();
                bonus_block.beginFill(0xFF0000);
                bonus_block.drawRect(pos_s - local_width, HEIGHT - local_height - this.bonus_size - this.bonus_gap, this.bonus_size, this.bonus_size);
                bonus_block.endFill();
                this.bonus_ground.addChild(bonus_block);
                for (let pos = pos_s - local_width; pos < pos_s + this.bonus_size; pos ++) {
                    this.bonus_height_arr[Math.round(pos)] = HEIGHT - local_height - this.bonus_size - this.bonus_gap;
                }
            }
        }
    }

    generateNew() {
        this.addBlockToForeGround(this.next_fore_ground);
        this.next_fore_ground.position.x = WIDTH;
    }

    removeChildren(a) {
        for (let child_idx = a.children.length - 1; child_idx >=0; child_idx --) {
            a.removeChild(a.children[child_idx]);
        }
    }
    
    moveChildren(a, b) {
        this.removeChildren(a);
        for (let child_idx = b.children.length - 1; child_idx >=0; child_idx --) {
            a.addChild(b.children[child_idx]);
        }
    }
    
    update(accel) {
        if (accel) {
            this.pause = false;
        }
        if (this.pause) {
            let cur_pos = - Math.round(this.fore_ground.position.x);
            return this.height_arr.slice( cur_pos, cur_pos + WIDTH );
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

        this.fore_ground.position.x -= this.s;
        this.bonus_ground.position.x -= this.s;

        let cur_pos = - Math.round(this.fore_ground.position.x);
        return [this.height_arr.slice( cur_pos, cur_pos + WIDTH ), this.bonus_height_arr.slice( cur_pos, cur_pos + WIDTH )];

        /*
        this.prev_fore_ground.position.x -= this.s;
        this.cur_fore_ground.position.x -= this.s;
        this.next_fore_ground.position.x -= this.s;
        
        console.log(this.prev_fore_ground.position.x + " " +
            this.cur_fore_ground.position.x + " " +
            this.next_fore_ground.position.x);
        
        if (this.cur_fore_ground.position.x < WIDTH / 2 && !this.passed_flag) {
            this.generateNew();
            this.passed_flag = true;
        }
        else if (this.cur_fore_ground.position.x < 0 && this.passed_flag) {
            this.moveChildren(this.prev_fore_ground, this.cur_fore_ground);
            this.moveChildren(this.cur_fore_ground, this.next_fore_ground);
            this.removeChildren(this.next_fore_ground);
            this.prev_fore_ground.position.x = this.cur_fore_ground.position.x;
            this.cur_fore_ground.position.x = this.next_fore_ground.position.x;
            this.passed_flag = false;
        }
        */
    }

    reset() {
        this.s = this.s_base;
        this.pause = true;
    }

    
    getHeights() {
        return this.height_arr;
    }
    
};

