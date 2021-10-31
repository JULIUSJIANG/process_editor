import globalContext from "../GlobalContext";
import FBO from "../struct/FBO";

export default function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
    globalContext.gl.activeTexture(globalContext.gl.TEXTURE0);
    let texture = globalContext.gl.createTexture() as WebGLTexture;
    globalContext.gl.bindTexture(globalContext.gl.TEXTURE_2D, texture);
    globalContext.gl.texParameteri(globalContext.gl.TEXTURE_2D, globalContext.gl.TEXTURE_MIN_FILTER, param);
    globalContext.gl.texParameteri(globalContext.gl.TEXTURE_2D, globalContext.gl.TEXTURE_MAG_FILTER, param);
    globalContext.gl.texParameteri(globalContext.gl.TEXTURE_2D, globalContext.gl.TEXTURE_WRAP_S, globalContext.gl.CLAMP_TO_EDGE);
    globalContext.gl.texParameteri(globalContext.gl.TEXTURE_2D, globalContext.gl.TEXTURE_WRAP_T, globalContext.gl.CLAMP_TO_EDGE);
    globalContext.gl.texImage2D(globalContext.gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    let fbo = globalContext.gl.createFramebuffer() as WebGLFramebuffer;
    globalContext.gl.bindFramebuffer(globalContext.gl.FRAMEBUFFER, fbo);
    globalContext.gl.framebufferTexture2D(globalContext.gl.FRAMEBUFFER, globalContext.gl.COLOR_ATTACHMENT0, globalContext.gl.TEXTURE_2D, texture, 0);
    globalContext.gl.viewport(0, 0, w, h);
    globalContext.gl.clear(globalContext.gl.COLOR_BUFFER_BIT);

    let texelSizeX = 1.0 / w;
    let texelSizeY = 1.0 / h;

    return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id: number) {
            globalContext.gl.activeTexture(globalContext.gl.TEXTURE0 + id);
            globalContext.gl.bindTexture(globalContext.gl.TEXTURE_2D, texture);
            return id;
        }
    };
}