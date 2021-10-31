import globalContext from "../GlobalContext";

export default class FBO {
    texture: WebGLTexture = null as any;
    fbo: WebGLFramebuffer = null as any;
    width: number = null as any;
    height: number = null as any;
    texelSizeX: number = null as any;
    texelSizeY: number = null as any;
    attach: (id: number) => number = null as any;
}