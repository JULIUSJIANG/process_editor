import globalContext from "../GlobalContext";
import FBO from "../struct/FBO";
import applyBloom from "./applyBloom";
import applySunrays from "./applySunrays";
import blur from "./blur";
import drawCheckerboard from "./drawCheckerboard";
import drawColor from "./drawColor";
import drawDisplay from "./drawDisplay";
import normalizeColor from "./normalizeColor";

export default function render (target: FBO) {
    if (globalContext.config.BLOOM)
        applyBloom(globalContext.dye.read, globalContext.bloom);
    if (globalContext.config.SUNRAYS) {
        applySunrays(globalContext.dye.read, globalContext.dye.write, globalContext.sunrays);
        blur(globalContext.sunrays, globalContext.sunraysTemp, 1);
    }

    if (target == null || !globalContext.config.TRANSPARENT) {
        globalContext.gl.blendFunc(globalContext.gl.ONE, globalContext.gl.ONE_MINUS_SRC_ALPHA);
        globalContext.gl.enable(globalContext.gl.BLEND);
    }
    else {
        globalContext.gl.disable(globalContext.gl.BLEND);
    }

    if (!globalContext.config.TRANSPARENT)
        drawColor(target, normalizeColor(globalContext.config.BACK_COLOR));
    if (target == null && globalContext.config.TRANSPARENT)
        drawCheckerboard(target);
    drawDisplay(target);
}