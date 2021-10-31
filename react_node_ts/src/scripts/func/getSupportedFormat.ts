import supportRenderTextureFormat from "./supportRenderTextureFormat";

export default function getSupportedFormat(gl: WebGLRenderingContext & WebGL2RenderingContext, internalFormat: number, format: number, type: number): { internalFormat: number, format: number } {
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
            case gl.R16F:
                return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
            case gl.RG16F:
                return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
            default:
                return null as any;
        }
    }

    return {
        internalFormat,
        format
    }
}