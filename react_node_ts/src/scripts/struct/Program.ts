import createProgram from "../func/createProgram";
import getUniforms from "../func/getUniforms";
import globalContext from "../GlobalContext";
import UniformParams from "./UniformParams";

export class Program {

    public program: WebGLProgram;;

    public uniforms: WebGLUniformLocation[] & UniformParams = [] as any;

    constructor (vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = getUniforms(this.program) as any;
    }

    bind () {
        globalContext.gl.useProgram(this.program);
    }
}