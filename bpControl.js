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
        this.stage = 1;
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

    chooseRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    addBlock(total_width = 10 * WIDTH, block_min_width = 100, block_width_diff = 300, block_max_gap = 100, block_max_height = HEIGHT / 3 ) {
        this.height_arr = new Array(total_width).fill(HEIGHT);
        this.bonus_height_arr = new Array(total_width).fill(HEIGHT + 1);
        let pos_s = 0;
        let window_colors = [0xd7d5d2, 0xb2afaa, 0x2a5b88, 0x2161b2];
        let building_colors = [0x2d5f75, 0x287460, 0x4c5470, 0x2b5f51];
        while (pos_s < total_width) {
            const block = new PIXI.Graphics();
            block.beginFill(this.chooseRandom(building_colors));
            let local_height = Math.random() * block_max_height;
            let local_width = Math.random() * block_width_diff + block_min_width;
            pos_s += (local_width + Math.random() * block_max_gap);
            block.drawRect(pos_s - local_width, HEIGHT - local_height, local_width, local_height);
            block.endFill();

            this.fore_ground.addChild(block);

            let x_number = Math.round(Math.random() * local_width / 20 + 5);
            let y_number = Math.round(Math.round(local_height / 30));
            let local_prob = Math.random() * 0.6 + 0.2;
            
            for (let x = 0; x < x_number; x ++) {
                for (let y = 0; y < y_number; y ++) {
                    if (Math.random() < local_prob) {
                        continue;
                    }
                    const block_w = new PIXI.Graphics();
                    block_w.beginFill(this.chooseRandom(window_colors));
                    let local_height_w = 30;
                    let local_width_w = (local_width - 20 - ((x_number - 1) * 5)) / x_number;
                    block_w.drawRect(pos_s - local_width + 10 + x * (5 + local_width_w) , HEIGHT - local_height + 10 + y * 35, local_width_w, local_height_w);
                    block_w.endFill();
                    this.fore_ground.addChild(block_w);
                }
            }

            for (let pos = pos_s - local_width; pos < pos_s; pos ++) {
                this.height_arr[Math.round(pos)] = HEIGHT - local_height;
            }

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

    revive() {
        this.s = this.s_base;
        this.pause = true;
    }

    reset () {
        this.fore_ground.position.x = WIDTH;
        this.bonus_ground.position.x = WIDTH;
    }

    
    getHeights() {
        return this.height_arr;
    }
    
};

