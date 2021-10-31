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

    let dye;
    let velocity;
    let divergence;
    let curl;
    let pressure;
    let bloom;
    let bloomFramebuffers = [];
    let sunrays;
    let sunraysTemp;

    let ditheringTexture: Texture;

    let blurProgram: Program;
    let copyProgram: Program;
    let clearProgram: Program;
    let colorProgram: Program;
    let checkerboardProgram: Program;
    let bloomPrefilterProgram: Program;
    let bloomBlurProgram: Program;
    let bloomFinalProgram: Program;
    let sunraysMaskProgram: Program;
    let sunraysProgram: Program;
    let splatProgram: Program;
    let advectionProgram: Program;
    let divergenceProgram: Program;
    let curlProgram: Program;
    let vorticityProgram: Program;
    let pressureProgram: Program;
    let gradienSubtractProgram: Program;

    let displayMaterial: Material;

    export function init(canvas: HTMLCanvasElement) {
        const { gl, ext } = getWebGLContext(canvas);
        globalContext.gl = gl;
        globalContext.ext = ext;

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
    }

    function getWebGLContext(canvas: HTMLCanvasElement): GLContext {
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

    function getSupportedFormat(gl: WebGLRenderingContext & WebGL2RenderingContext, internalFormat: number, format: number, type: number): { internalFormat: number, format: number } {
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

    function supportRenderTextureFormat(gl: WebGLRenderingContext & WebGL2RenderingContext, internalFormat: number, format: number, type: number) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

        let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        return status == gl.FRAMEBUFFER_COMPLETE;
    }

    function framebufferToTexture(target: FBO) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        let length = target.width * target.height * 4;
        let texture = new Float32Array(length);
        gl.readPixels(0, 0, target.width, target.height, gl.RGBA, gl.FLOAT, texture);
        return texture;
    }

    function normalizeTexture(texture: Float32Array, width: number, height: number) {
        let result = new Uint8Array(texture.length);
        let id = 0;
        for (let i = height - 1; i >= 0; i--) {
            for (let j = 0; j < width; j++) {
                let nid = i * width * 4 + j * 4;
                result[nid + 0] = clamp01(texture[id + 0]) * 255;
                result[nid + 1] = clamp01(texture[id + 1]) * 255;
                result[nid + 2] = clamp01(texture[id + 2]) * 255;
                result[nid + 3] = clamp01(texture[id + 3]) * 255;
                id += 4;
            }
        }
        return result;
    }

    function clamp01(input: number) {
        return Math.min(Math.max(input, 0), 1);
    }

    export function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        let program = gl.createProgram() as WebGLProgram;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            console.trace(gl.getProgramInfoLog(program));

        return program;
    }

    export function getUniforms(program: WebGLProgram) {
        let uniforms: WebGLUniformLocation[] = [];
        let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            let uniformName = (gl.getActiveUniform(program, i) as WebGLActiveInfo).name;
            uniforms[uniformName as any] = gl.getUniformLocation(program, uniformName) as WebGLUniformLocation;
        }
        return uniforms;
    }

    export function compileShader(type: number, source: string, keywords: string[]) {
        source = addKeywords(source, keywords);

        const shader = gl.createShader(type) as WebGLShader;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            console.trace(gl.getShaderInfoLog(shader));

        return shader;
    };

    function addKeywords(source: string, keywords: string[]) {
        if (keywords == null) return source;
        let keywordsString = '';
        keywords.forEach(keyword => {
            keywordsString += '#define ' + keyword + '\n';
        });
        return keywordsString + source;
    }

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
        gl.activeTexture(gl.TEXTURE0);
        let texture = gl.createTexture() as WebGLTexture;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

        let fbo = gl.createFramebuffer() as WebGLFramebuffer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);

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
                gl.activeTexture(gl.TEXTURE0 + id);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                return id;
            }
        };
    }

    export function hashCode(s: string) {
        if (s.length == 0) return 0;
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = (hash << 5) - hash + s.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    function CHECK_FRAMEBUFFER_STATUS() {
        let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status != gl.FRAMEBUFFER_COMPLETE)
            console.trace("Framebuffer error: " + status);
    }

    function createTextureAsync(url: string): Texture {
        let texture = gl.createTexture() as WebGLTexture;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));

        let obj = {
            texture,
            width: 1,
            height: 1,
            attach(id: number) {
                gl.activeTexture(gl.TEXTURE0 + id);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                return id;
            }
        };

        let image = new Image();
        image.onload = () => {
            obj.width = image.width;
            obj.height = image.height;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        };
        image.src = url;

        return obj;
    }
}
export default globalContext;