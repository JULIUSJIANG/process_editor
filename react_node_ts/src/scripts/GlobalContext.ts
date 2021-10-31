import compileShader from "./func/compileShader";
import createTextureAsync from "./func/createTextureAsync";
import getWebGLContext from "./func/getWebGLContext";
import initFramebuffers from "./func/initFramebuffers";
import multipleSplats from "./func/multipleSplats";
import resizeCanvas from "./func/resizeCanvas";
import scaleByPixelRatio from "./func/scaleByPixelRatio";
import update from "./func/update";
import updatePointerDownData from "./func/updatePointerDownData";
import updatePointerMoveData from "./func/updatePointerMoveData";
import updatePointerUpData from "./func/updatePointerUpData";
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

const globalContext = {
    config: {
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
    },

    pointers: [] as PointerPrototype[],

    splatStack: [] as number[],

    gl: null as WebGLRenderingContext & WebGL2RenderingContext,

    canvas: null as HTMLCanvasElement,

    ext: null as GLExt,

    baseVertexShader: null as WebGLShader,
    blurVertexShader: null as WebGLShader,
    blurShader: null as WebGLShader,
    copyShader: null as WebGLShader,
    clearShader: null as WebGLShader,
    colorShader: null as WebGLShader,
    checkerboardShader: null as WebGLShader,
    bloomPrefilterShader: null as WebGLShader,
    bloomBlurShader: null as WebGLShader,
    bloomFinalShader: null as WebGLShader,
    sunraysMaskShader: null as WebGLShader,
    sunraysShader: null as WebGLShader,
    splatShader: null as WebGLShader,
    advectionShader: null as WebGLShader,
    divergenceShader: null as WebGLShader,
    curlShader: null as WebGLShader,
    vorticityShader: null as WebGLShader,
    pressureShader: null as WebGLShader,
    gradientSubtractShader: null as WebGLShader,

    blit: null as (target: FBO, clear: any) => void,

    dye: null as DoubleFBO,
    velocity: null as DoubleFBO,
    divergence: null as FBO,
    curl: null as FBO,
    pressure: null as DoubleFBO,
    bloom: null as FBO,
    bloomFramebuffers: [] as FBO[],
    sunrays: null as FBO,
    sunraysTemp: null as FBO,

    ditheringTexture: null as Texture,

    blurProgram: null as Program,
    copyProgram: null as Program,
    clearProgram: null as Program,
    colorProgram: null as Program,
    checkerboardProgram: null as Program,
    bloomPrefilterProgram: null as Program,
    bloomBlurProgram: null as Program,
    bloomFinalProgram: null as Program,
    sunraysMaskProgram: null as Program,
    sunraysProgram: null as Program,
    splatProgram: null as Program,
    advectionProgram: null as Program,
    divergenceProgram: null as Program,
    curlProgram: null as Program,
    vorticityProgram: null as Program,
    pressureProgram: null as Program,
    gradienSubtractProgram: null as Program,

    displayMaterial: null as Material,

    lastUpdateTime: null as number,
    colorUpdateTimer: null as number,

    init(canvasInput: HTMLCanvasElement) {
        this.canvas = canvasInput;
        resizeCanvas();
        this.pointers.push(new PointerPrototype());
        const glCtx = getWebGLContext(canvasInput);
        this.gl = glCtx.gl;
        this.ext = glCtx.ext;

        this.baseVertexShader = compileShader(this.gl.VERTEX_SHADER, baseVertexShaderTxt, null as any);
        this.blurVertexShader = compileShader(this.gl.VERTEX_SHADER, blurVertexShaderTxt, null as any);
        this.blurShader = compileShader(this.gl.FRAGMENT_SHADER, blurShaderTxt, null as any);
        this.copyShader = compileShader(this.gl.FRAGMENT_SHADER, copyShaderTxt, null as any);
        this.clearShader = compileShader(this.gl.FRAGMENT_SHADER, clearShaderTxt, null as any);
        this.colorShader = compileShader(this.gl.FRAGMENT_SHADER, colorShaderTxt, null as any);
        this.checkerboardShader = compileShader(this.gl.FRAGMENT_SHADER, checkerboardShaderTxt, null as any);
        this.bloomPrefilterShader = compileShader(this.gl.FRAGMENT_SHADER, bloomPrefilterShaderTxt, null as any);
        this.bloomBlurShader = compileShader(this.gl.FRAGMENT_SHADER, bloomBlurShaderTxt, null as any);
        this.bloomFinalShader = compileShader(this.gl.FRAGMENT_SHADER, bloomFinalShaderTxt, null as any);
        this.sunraysMaskShader = compileShader(this.gl.FRAGMENT_SHADER, sunraysMaskShaderTxt, null as any);
        this.sunraysShader = compileShader(this.gl.FRAGMENT_SHADER, sunraysShaderTxt, null as any);
        this.splatShader = compileShader(this.gl.FRAGMENT_SHADER, splatShaderTxt, null as any);
        this.advectionShader = compileShader(this.gl.FRAGMENT_SHADER, advectionShaderTxt, null as any);
        this.divergenceShader = compileShader(this.gl.FRAGMENT_SHADER, divergenceShaderTxt, null as any);
        this.curlShader = compileShader(this.gl.FRAGMENT_SHADER, curlShaderTxt, null as any);
        this.vorticityShader = compileShader(this.gl.FRAGMENT_SHADER, vorticityShaderTxt, null as any);
        this.pressureShader = compileShader(this.gl.FRAGMENT_SHADER, pressureShaderTxt, null as any);
        this.gradientSubtractShader = compileShader(this.gl.FRAGMENT_SHADER, gradientSubtractShaderTxt, null as any);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.createBuffer());
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(0);

        this.blit = (target: FBO, clear: boolean) => {
            if (target == null) {
                this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            }
            else {
                this.gl.viewport(0, 0, target.width, target.height);
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target.fbo);
            }
            if (clear) {
                this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            }
            // CHECK_FRAMEBUFFER_STATUS();
            this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
        }

        this.ditheringTexture = createTextureAsync(`LDR_LLL1_0.png`);

        this.blurProgram = new Program(this.blurVertexShader, this.blurShader);
        this.copyProgram = new Program(this.baseVertexShader, this.copyShader);
        this.clearProgram = new Program(this.baseVertexShader, this.clearShader);
        this.colorProgram = new Program(this.baseVertexShader, this.colorShader);
        this.checkerboardProgram = new Program(this.baseVertexShader, this.checkerboardShader);
        this.bloomPrefilterProgram = new Program(this.baseVertexShader, this.bloomPrefilterShader);
        this.bloomBlurProgram = new Program(this.baseVertexShader, this.bloomBlurShader);
        this.bloomFinalProgram = new Program(this.baseVertexShader, this.bloomFinalShader);
        this.sunraysMaskProgram = new Program(this.baseVertexShader, this.sunraysMaskShader);
        this.sunraysProgram = new Program(this.baseVertexShader, this.sunraysShader);
        this.splatProgram = new Program(this.baseVertexShader, this.splatShader);
        this.advectionProgram = new Program(this.baseVertexShader, this.advectionShader);
        this.divergenceProgram = new Program(this.baseVertexShader, this.divergenceShader);
        this.curlProgram = new Program(this.baseVertexShader, this.curlShader);
        this.vorticityProgram = new Program(this.baseVertexShader, this.vorticityShader);
        this.pressureProgram = new Program(this.baseVertexShader, this.pressureShader);
        this.gradienSubtractProgram = new Program(this.baseVertexShader, this.gradientSubtractShader);

        this.displayMaterial = new Material(baseVertexShaderTxt, displayShaderSourceTxt);

        initFramebuffers();
        multipleSplats(parseInt(Math.random() * 20 + ``) + 5);

        this.lastUpdateTime = Date.now();
        this.colorUpdateTimer = 0;

        update();

        this.canvas.addEventListener('mousedown', e => {
            let posX = scaleByPixelRatio(e.offsetX);
            let posY = scaleByPixelRatio(e.offsetY);
            let pointer = this.pointers.find(p => p.id == -1);
            if (pointer == null)
                pointer = new PointerPrototype();
            updatePointerDownData(pointer, -1, posX, posY);
        });
        
        this.canvas.addEventListener('mousemove', e => {
            let pointer = this.pointers[0];
            if (!pointer.down) return;
            let posX = scaleByPixelRatio(e.offsetX);
            let posY = scaleByPixelRatio(e.offsetY);
            updatePointerMoveData(pointer, posX, posY);
        });
        
        window.addEventListener('mouseup', () => {
            updatePointerUpData(this.pointers[0]);
        });
        
        this.canvas.addEventListener('touchstart', e => {
            e.preventDefault();
            const touches = e.targetTouches;
            while (touches.length >= this.pointers.length)
                this.pointers.push(new PointerPrototype());
            for (let i = 0; i < touches.length; i++) {
                let posX = scaleByPixelRatio(touches[i].pageX);
                let posY = scaleByPixelRatio(touches[i].pageY);
                updatePointerDownData(this.pointers[i + 1], touches[i].identifier, posX, posY);
            }
        });
        
        this.canvas.addEventListener('touchmove', e => {
            e.preventDefault();
            const touches = e.targetTouches;
            for (let i = 0; i < touches.length; i++) {
                let pointer = this.pointers[i + 1];
                if (!pointer.down) continue;
                let posX = scaleByPixelRatio(touches[i].pageX);
                let posY = scaleByPixelRatio(touches[i].pageY);
                updatePointerMoveData(pointer, posX, posY);
            }
        }, false);
        
        window.addEventListener('touchend', e => {
            const touches = e.changedTouches;
            for (let i = 0; i < touches.length; i++)
            {
                let pointer = this.pointers.find(p => p.id == touches[i].identifier);
                if (pointer == null) continue;
                updatePointerUpData(pointer);
            }
        });
    }
}
export default globalContext;