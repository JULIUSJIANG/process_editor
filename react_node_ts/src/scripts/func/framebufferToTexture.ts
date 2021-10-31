import globalContext from "../GlobalContext";
import FBO from "../struct/FBO";

export default function framebufferToTexture(target: FBO) {
    globalContext.gl.bindFramebuffer(globalContext.gl.FRAMEBUFFER, target.fbo);
    let length = target.width * target.height * 4;
    let texture = new Float32Array(length);
    globalContext.gl.readPixels(0, 0, target.width, target.height, globalContext.gl.RGBA, globalContext.gl.FLOAT, texture);
    return texture;
}