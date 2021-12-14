import {HEIGHT} from "./app.js";

export default class Ship {
    
    constructor (ship) {
        this.v = 0;
        this.x_v = 0;
        this.g = 3;
        this.a_base = 6;
        this.a = this.a_base;
        this.up_limit = 10;
        this.down_limit = 10;
        this.float_a = 0.5;
        this.right_limit = 300;
        this.left_limit = 100;
        this.x_a_max = 0.5;
        this.x_a = this.x_a_max;
        this.x_a_resist = 0.05;
        this.x_resist = 0.1;
        this.x_brake_a = 3;
        this.slow_down_speed_x = -1;
        this.slow_down_region_x = (this.right_limit - this.left_limit) / 2 + this.left_limit;
        this.ship = ship;
        this.release_control = false;
        this.base_fuel = 50;
        this.fuel = this.base_fuel;
        this.max_fuel = 100;
        this.allow_fuel = true;
        this.power_fuel_con = 0.2;
        this.float_fuel_con = 0.02;
    }
    

    update(accel) {
        //console.log(this.ship.y);
        if (accel) {
            this.release_control = false;
        }
        if (this.release_control) {
            return;
        }
        
        if(accel === 1){
            this.fuel -= this.power_fuel_con;
            if (this.ship.angle > -20) {
                this.ship.angle -= 1;
            }
            if (this.v > -this.up_limit) {
                this.v -= (- this.g + this.a);
            }
            if (this.ship.x < this.right_limit) {
                this.x_a = this.x_a > 0 ? this.x_a - this.x_a_resist : this.x_a;
                this.x_v += this.x_a;
            }
            this.ship.getChildAt(1).visible = true;
            this.ship.getChildAt(0).visible = false;
        }
        else if (accel === -1) {
            this.fuel -= this.power_fuel_con;
            this.v = 0;
            if (this.ship.x < this.right_limit) {
                this.x_v -= this.x_brake_a;
            }
            this.ship.getChildAt(1).visible = false;
            this.ship.getChildAt(0).visible = true;
            //if (this.ship.x <= this.left_limit) {
            //    this.ship.getChildAt(0).visible = false;
            //}
        }
        else {
            this.fuel -= this.float_fuel_con;
            this.ship.getChildAt(1).visible = false;
            this.ship.getChildAt(0).visible = false;
            this.x_a = this.x_a_max;
            if (this.ship.angle < -10) {
                this.ship.angle += 1;
            }
            if (this.v < 0) {
                this.v += this.g ;
                
            }
            /*
            else if (this.v < this.down_limit) {
                this.v += this.float_a;
            }
            */
            else {
                this.v = 2 * this.down_limit * Math.atan((HEIGHT - this.ship.y - 20) / HEIGHT);
            }
            if (this.ship.x < this.slow_down_region_x && this.x_v < this.slow_down_speed_x) {
                //console.log("slow down");
                this.x_v += this.x_resist;
            }
            else {
                this.x_v -= this.x_resist;
            }
            
        }
        
        this.ship.y += this.v;
        this.ship.x += this.x_v;
        if (this.ship.y > HEIGHT){
            this.ship.y = HEIGHT;
            this.v = 0;
        }
        else if (this.ship.y < 0) {
            this.ship.y = 0;
            this.v = 0;
        }
        if (this.ship.x > this.right_limit) {
            this.ship.x = this.right_limit;
            this.x_v = 0;
        }
        else if (this.ship.x < this.left_limit) {
            this.ship.x = this.left_limit;
            this.x_v = 0;
        }
    }

    checkBumperCollision (bumper_heights) {
        //console.log(this.ship.y + " " + bumper_heights[Math.round(this.ship.x)]);
        return this.ship.y > bumper_heights[Math.round(this.ship.x)] || this.ship.y > bumper_heights[Math.round(this.ship.x + this.ship.width)];
    }

    checkFuel () {
        return this.fuel > 0;
    }

    getFuel () {
        return this.fuel;
    }

    addFuel (fuel) {
        if (this.allow_fuel) {
            this.fuel += fuel;
            this.allow_fuel = false;
            setTimeout(() => {
                this.allow_fuel = true;
            }, 1000);
        }
        if (this.fuel > this.max_fuel) {
            this.fuel = this.max_fuel;
        }
    }

    revive (position = HEIGHT / 2) {
        this.ship.position.y = position;
        this.v = 0;
        this.x_v = 0;
        this.a = this.a_base;
        this.x_a = this.x_a_max;
        this.releaseControl();
    }
    
    reset () {
        this.revive();
        this.fuel = this.base_fuel;
    }

    releaseControl() {
        this.release_control = true;
    }
} 
