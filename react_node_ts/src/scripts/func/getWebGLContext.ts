import { GLContext } from "../struct/GLContext";
import getSupportedFormat from "./getSupportedFormat";

export default function getWebGLContext(canvas: HTMLCanvasElement): GLContext {
    const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };

    let gl = canvas.getContext('webgl2', params) as WebGLRenderingContext & WebGL2RenderingContext;
    const isWebGL2 = !!gl;
    if (!isWebGL2)
        gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params) as any;

    let halfFloat: OES_texture_half_float;
    let supportLinearFiltering: OES_texture_float_linear;
    let halfFloatTexType: number;
    if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float');
        supportLinearFiltering = gl.getExtension('OES_texture_float_linear') as any;
        halfFloatTexType = gl.HALF_FLOAT;
    } else {
        halfFloat = gl.getExtension('OES_texture_half_float') as any;
        supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear') as any;
        halfFloatTexType = halfFloat && halfFloat.HALF_FLOAT_OES;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    let formatRGBA;
    let formatRG;
    let formatR;

    if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
    }
    else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    return {
        gl,
        ext: {
            formatRGBA,
            formatRG,
            formatR,
            halfFloatTexType,
            supportLinearFiltering
        }
    };
}