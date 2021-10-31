import globalContext from "../GlobalContext";
import createFBO from "./createFBO";
import getResolution from "./getResolution";

export default function initBloomFramebuffers () {
    let res = getResolution(globalContext.config.BLOOM_RESOLUTION);

    const texType = globalContext.ext.halfFloatTexType;
    const rgba = globalContext.ext.formatRGBA;
    const filtering = globalContext.ext.supportLinearFiltering ? globalContext.gl.LINEAR : globalContext.gl.NEAREST;

    globalContext.bloom = createFBO(res.width, res.height, rgba.internalFormat, rgba.format, texType, filtering);

    globalContext.bloomFramebuffers.length = 0;
    for (let i = 0; i < globalContext.config.BLOOM_ITERATIONS; i++)
    {
        let width = res.width >> (i + 1);
        let height = res.height >> (i + 1);

        if (width < 2 || height < 2) break;

        let fbo = createFBO(width, height, rgba.internalFormat, rgba.format, texType, filtering);
        globalContext.bloomFramebuffers.push(fbo);
    }
}