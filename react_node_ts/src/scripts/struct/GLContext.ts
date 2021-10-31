import { GLExt } from "./GLExt";

export class GLContext {
    gl: WebGLRenderingContext & WebGL2RenderingContext = null as any;
    ext: GLExt = null as any;
}