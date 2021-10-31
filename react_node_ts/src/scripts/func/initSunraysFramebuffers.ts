import globalContext from "../GlobalContext";
import createFBO from "./createFBO";
import { getResolution } from "./getResolution";

export default function initSunraysFramebuffers() {
    let res = getResolution(globalContext.config.SUNRAYS_RESOLUTION);

    const texType = globalContext.ext.halfFloatTexType;
    const r = globalContext.ext.formatR;
    const filtering = globalContext.ext.supportLinearFiltering ? globalContext.gl.LINEAR : globalContext.gl.NEAREST;

    globalContext.sunrays = createFBO(res.width, res.height, r.internalFormat, r.format, texType, filtering);
    globalContext.sunraysTemp = createFBO(res.width, res.height, r.internalFormat, r.format, texType, filtering);
}