import compileShader from "./func/compileShader";
import createTextureAsync from "./func/createTextureAsync";
import getWebGLContext from "./func/getWebGLContext";
import initFramebuffers from "./func/initFramebuffers";
import { advectionShaderTxt } from "./shader/advectionShaderTxt";
import { baseVertexShaderTxt } from "./shader/baseVertexShaderTxt";
import { bloomBlurShaderTxt } from "./shader/bloomBlurShaderTxt";
import { bloomFinalShaderTxt } from "./shader/bloomFinalShaderTxt";
import { bloomPrefilterShaderTxt } from "./shader/bloomPrefilterShaderTxt";
import { blurShaderTxt } from "./shader/blurShaderTxt";
import { blurVertexShaderTxt } from "./shader/blurVertexShaderTxt";
import { checkerboardShaderTxt } from "./shader/checkerboardShaderTxt";
import { clearShaderTxt } from "./shader/clearShaderTxt";
import { colorShaderTxt } from "./shader/colorShaderTxt";
import { copyShaderTxt } from "./shader/copyShaderTxt";
import { curlShaderTxt } from "./shader/curlShaderTxt";
import { displayShaderSourceTxt } from "./shader/displayShaderSourceTxt";
import { divergenceShaderTxt } from "./shader/divergenceShaderTxt";
import { gradientSubtractShaderTxt } from "./shader/gradientSubtractShaderTxt";
import { pressureShaderTxt } from "./shader/pressureShaderTxt";
import { splatShaderTxt } from "./shader/splatShaderTxt";
import { sunraysMaskShaderTxt } from "./shader/sunraysMaskShaderTxt";
import { sunraysShaderTxt } from "./shader/sunraysShaderTxt";
import { vorticityShaderTxt } from "./shader/vorticityShaderTxt";
import Color from "./struct/Color";
import DoubleFBO from "./struct/DoubleFBO";
import FBO from "./struct/FBO";
import { GLContext } from "./struct/GLContext";
import { GLExt } from "./struct/GLExt";
import Material from "./struct/Material";
import { PointerPrototype } from "./struct/PointerPrototype";
import { Program } from "./struct/Program";
import Texture from "./struct/Texture";

namespace globalContext {
    export const config = {
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1,
        VELOCITY_DISSIPATION: 0.2,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30,
        SPLAT_RADIUS: 0.25,
        SPLAT_FORCE: 6000,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: {
            r: 0,
            g: 0,
            b: 0
        },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.8,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: true,
        SUNRAYS_RESOLUTION: 196,
        SUNRAYS_WEIGHT: 1.0,
    }

    export const pointers: PointerPrototype[] = [];

    export const splatStack: number[] = [];

    export let gl: WebGLRenderingContext & WebGL2RenderingContext;

    export let canvas: HTMLCanvasElement;

    export let ext: GLExt;

    export let baseVertexShader: WebGLShader;
    export let blurVertexShader: WebGLShader;
    export let blurShader: WebGLShader;
    export let copyShader: WebGLShader;
    export let clearShader: WebGLShader;
    export let colorShader: WebGLShader;
    export let checkerboardShader: WebGLShader;
    export let bloomPrefilterShader: WebGLShader;
    export let bloomBlurShader: WebGLShader;
    export let bloomFinalShader: WebGLShader;
    export let sunraysMaskShader: WebGLShader;
    export let sunraysShader: WebGLShader;
    export let splatShader: WebGLShader;
    export let advectionShader: WebGLShader;
    export let divergenceShader: WebGLShader;
    export let curlShader: WebGLShader;
    export let vorticityShader: WebGLShader;
    export let pressureShader: WebGLShader;
    export let gradientSubtractShader: WebGLShader;

    export let blit: (target: FBO, clear: any) => void;

    export let dye: DoubleFBO;
    export let velocity: DoubleFBO;
    export let divergence: any;
    export let curl: any;
    export let pressure: any;
    export let bloom: FBO;
    export let bloomFramebuffers: WebGLFramebuffer[] = [];
    export let sunrays: any;
    export let sunraysTemp: any;

    export let ditheringTexture: Texture;

    export let blurProgram: Program;
    export let copyProgram: Program;
    export let clearProgram: Program;
    export let colorProgram: Program;
    export let checkerboardProgram: Program;
    export let bloomPrefilterProgram: Program;
    export let bloomBlurProgram: Program;
    export let bloomFinalProgram: Program;
    export let sunraysMaskProgram: Program;
    export let sunraysProgram: Program;
    export let splatProgram: Program;
    export let advectionProgram: Program;
    export let divergenceProgram: Program;
    export let curlProgram: Program;
    export let vorticityProgram: Program;
    export let pressureProgram: Program;
    export let gradienSubtractProgram: Program;

    export let displayMaterial: Material;

    export function init(canvasInput: HTMLCanvasElement) {
        canvas = canvasInput;
        const glCtx = getWebGLContext(canvasInput);
        gl = glCtx.gl;
        ext = glCtx.ext;

        baseVertexShader = compileShader(gl.VERTEX_SHADER, baseVertexShaderTxt, null as any);
        blurVertexShader = compileShader(gl.VERTEX_SHADER, blurVertexShaderTxt, null as any);
        blurShader = compileShader(gl.FRAGMENT_SHADER, blurShaderTxt, null as any);
        copyShader = compileShader(gl.FRAGMENT_SHADER, copyShaderTxt, null as any);
        clearShader = compileShader(gl.FRAGMENT_SHADER, clearShaderTxt, null as any);
        colorShader = compileShader(gl.FRAGMENT_SHADER, colorShaderTxt, null as any);
        checkerboardShader = compileShader(gl.FRAGMENT_SHADER, checkerboardShaderTxt, null as any);
        bloomPrefilterShader = compileShader(gl.FRAGMENT_SHADER, bloomPrefilterShaderTxt, null as any);
        bloomBlurShader = compileShader(gl.FRAGMENT_SHADER, bloomBlurShaderTxt, null as any);
        bloomFinalShader = compileShader(gl.FRAGMENT_SHADER, bloomFinalShaderTxt, null as any);
        sunraysMaskShader = compileShader(gl.FRAGMENT_SHADER, sunraysMaskShaderTxt, null as any);
        sunraysShader = compileShader(gl.FRAGMENT_SHADER, sunraysShaderTxt, null as any);
        splatShader = compileShader(gl.FRAGMENT_SHADER, splatShaderTxt, null as any);
        advectionShader = compileShader(gl.FRAGMENT_SHADER, advectionShaderTxt, null as any);
        divergenceShader = compileShader(gl.FRAGMENT_SHADER, divergenceShaderTxt, null as any);
        curlShader = compileShader(gl.FRAGMENT_SHADER, curlShaderTxt, null as any);
        vorticityShader = compileShader(gl.FRAGMENT_SHADER, vorticityShaderTxt, null as any);
        pressureShader = compileShader(gl.FRAGMENT_SHADER, pressureShaderTxt, null as any);
        gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, gradientSubtractShaderTxt, null as any);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        blit = (target: FBO, clear: boolean) => {
            if (target == null) {
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
            else {
                gl.viewport(0, 0, target.width, target.height);
                gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
            }
            if (clear) {
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            // CHECK_FRAMEBUFFER_STATUS();
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        }

        ditheringTexture = createTextureAsync(`LDR_LLL1_0.png`);

        blurProgram = new Program(blurVertexShader, blurShader);
        copyProgram = new Program(baseVertexShader, copyShader);
        clearProgram = new Program(baseVertexShader, clearShader);
        colorProgram = new Program(baseVertexShader, colorShader);
        checkerboardProgram = new Program(baseVertexShader, checkerboardShader);
        bloomPrefilterProgram = new Program(baseVertexShader, bloomPrefilterShader);
        bloomBlurProgram = new Program(baseVertexShader, bloomBlurShader);
        bloomFinalProgram = new Program(baseVertexShader, bloomFinalShader);
        sunraysMaskProgram = new Program(baseVertexShader, sunraysMaskShader);
        sunraysProgram = new Program(baseVertexShader, sunraysShader);
        splatProgram = new Program(baseVertexShader, splatShader);
        advectionProgram = new Program(baseVertexShader, advectionShader);
        divergenceProgram = new Program(baseVertexShader, divergenceShader);
        curlProgram = new Program(baseVertexShader, curlShader);
        vorticityProgram = new Program(baseVertexShader, vorticityShader);
        pressureProgram = new Program(baseVertexShader, pressureShader);
        gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);

        displayMaterial = new Material(baseVertexShaderTxt, displayShaderSourceTxt);

        initFramebuffers();
    }
}
export default globalContext;