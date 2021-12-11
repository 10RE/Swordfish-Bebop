import {HEIGHT} from "./app.js";

let v = 0;
const g = 3;
const a = 5;
const upLimit = 15;
const downLimit = 8;
const floatA = 5;

function shipUpdate(tar, givePower) {
    console.log(tar.y);
    
    if(givePower){
        if (tar.angle > -20) {
            tar.angle -= 1;
        }
        if (v > -upLimit) {
            v -= (- g + a);
        }
    }
    else {
        if (tar.angle < -10) {
            tar.angle += 1;
        }
        if (v < 0) {
            v += g ;
            
        }
        else if (v < downLimit) {
            v += floatA;
        }
        else {
            v = downLimit;
        }
    }
    
    tar.y += v;
    if(tar.y > HEIGHT){
        tar.y = HEIGHT;
        v = 0;
    }
}

export default shipUpdate;