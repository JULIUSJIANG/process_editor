import globalContext from "../GlobalContext";

export default class FBO {
    texture: WebGLTexture;;
    fbo: WebGLFramebuffer;;
    width: number;;
    height: number;;
    texelSizeX: number;;
    texelSizeY: number;;
    attach: (id: number) => number;;
}