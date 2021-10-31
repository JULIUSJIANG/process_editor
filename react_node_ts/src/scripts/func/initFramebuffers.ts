import globalContext from "../GlobalContext";
import FBO from "../struct/FBO";
import createDoubleFBO from "./createDoubleFBO";
import createFBO from "./createFBO";
import getResolution from "./getResolution";
import initBloomFramebuffers from "./initBloomFramebuffers";
import initSunraysFramebuffers from "./initSunraysFramebuffers";
import resizeDoubleFBO from "./resizeDoubleFBO";

export default function initFramebuffers () {
    let simRes = getResolution(globalContext.config.SIM_RESOLUTION);
    let dyeRes = getResolution(globalContext.config.DYE_RESOLUTION);

    const texType = globalContext.ext.halfFloatTexType;
    const rgba    = globalContext.ext.formatRGBA;
    const rg      = globalContext.ext.formatRG;
    const r       = globalContext.ext.formatR;
    const filtering = globalContext.ext.supportLinearFiltering ? globalContext.gl.LINEAR : globalContext.gl.NEAREST;

    globalContext.gl.disable(globalContext.gl.BLEND);

    if (globalContext.dye == null)
        globalContext.dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
    else
    globalContext.dye = resizeDoubleFBO(globalContext.dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

    if (globalContext.velocity == null)
        globalContext.velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
    else
        globalContext.velocity = resizeDoubleFBO(globalContext.velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

    globalContext.divergence = createFBO      (simRes.width, simRes.height, r.internalFormat, r.format, texType, globalContext.gl.NEAREST);
    globalContext.curl       = createFBO      (simRes.width, simRes.height, r.internalFormat, r.format, texType, globalContext.gl.NEAREST);
    globalContext.pressure   = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, globalContext.gl.NEAREST);

    initBloomFramebuffers();
    initSunraysFramebuffers();
}