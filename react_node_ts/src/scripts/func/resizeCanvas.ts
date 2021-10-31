import globalContext from "../GlobalContext";
import scaleByPixelRatio from "./scaleByPixelRatio";

export default function resizeCanvas () {
    let width = scaleByPixelRatio(globalContext.canvas.clientWidth);
    let height = scaleByPixelRatio(globalContext.canvas.clientHeight);
    if (globalContext.canvas.width != width || globalContext.canvas.height != height) {
        globalContext.canvas.width = width;
        globalContext.canvas.height = height;
        return true;
    }
    return false;
}