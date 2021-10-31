export default class Texture {
    texture: WebGLTexture = null as any;
    width: number = null as any;
    height: number = null as any;
    attach: (id: number) => number = null as any;
}