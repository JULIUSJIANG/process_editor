import globalContext from "../GlobalContext";

export class Program {

    public program: WebGLProgram = null as any;

    public uniforms: WebGLUniformLocation[] = [];

    constructor (vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.program = globalContext.createProgram(vertexShader, fragmentShader);
        this.uniforms = globalContext.getUniforms(this.program);
    }

    bind () {
        globalContext.gl.useProgram(this.program);
    }
}