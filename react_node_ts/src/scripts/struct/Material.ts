import compileShader from "../func/compileShader";
import createProgram from "../func/createProgram";
import getUniforms from "../func/getUniforms";
import hashCode from "../func/hashCode";
import globalContext from "../GlobalContext";

export default class Material {

    public vertexShader: string;;

    public fragmentShaderSource: string;;

    public programs: WebGLProgram[] = [];

    public uniforms: WebGLUniformLocation[] = [];

    public activeProgram: WebGLProgram;;

    constructor (vertexShader: string, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
    }

    setKeywords (keywords: string[]) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++)
            hash += hashCode(keywords[i]);

        let program = this.programs[hash];
        if (program == null)
        {
            let fragmentShader = compileShader(globalContext.gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
            program = createProgram(this.vertexShader, fragmentShader);
            this.programs[hash] = program;
        }

        if (program == this.activeProgram) return;

        this.uniforms = getUniforms(program);
        this.activeProgram = program;
    }

    bind () {
        globalContext.gl.useProgram(this.activeProgram);
    }
}