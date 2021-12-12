import {HEIGHT} from "./app.js";

let v = 0;
let x_v = 0;
const g = 3;
const a = 6;
const up_limit = 10;
const down_limit = 10;
const float_a = 5;
const right_limit = 250;
const left_limit = 50;
const x_a_max = 0.4;
let x_a = x_a_max;
const x_a_resist = 0.03;
const x_resist = 0.1;
const slow_down_speed_x = -1;
const slow_down_region_x = (right_limit - left_limit) / 2 + left_limit;

export default function shipUpdate(tar, give_power) {
    //console.log(tar.y);
    
    if(give_power){
        if (tar.angle > -20) {
            tar.angle -= 1;
        }
        if (v > -up_limit) {
            v -= (- g + a);
        }
        if (tar.x < right_limit) {
            x_a = x_a > 0 ? x_a - x_a_resist : x_a;
            x_v += x_a;
        }
    }
    else {
        x_a = x_a_max;
        if (tar.angle < -10) {
            tar.angle += 1;
        }
        if (v < 0) {
            v += g ;
            
        }
        else if (v < down_limit) {
            v += float_a;
        }
        else {
            v = down_limit;
        }
        if (tar.x < slow_down_region_x && x_v < slow_down_speed_x) {
            //console.log("slow down");
            x_v += x_resist;
        }
        else {
            x_v -= x_resist;
        }
        
    }
    
    tar.y += v;
    tar.x += x_v;
    if (tar.y > HEIGHT){
        tar.y = HEIGHT;
        v = 0;
    }
    else if (tar.y < 0) {
        tar.y = 0;
        v = 0;
    }
    if (tar.x > right_limit) {
        tar.x = right_limit;
        x_v = 0;
    }
    else if (tar.x < left_limit) {
        tar.x = left_limit;
        x_v = 0;
    }
}