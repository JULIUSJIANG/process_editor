import globalContext from "../GlobalContext";

export default class Material {

    public vertexShader: string = null as any;

    public fragmentShaderSource: string = null as any;

    public programs: WebGLProgram[] = [];

    public uniforms: WebGLUniformLocation[] = [];

    public activeProgram: WebGLProgram = null as any;

    constructor (vertexShader: string, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
    }

    setKeywords (keywords: string[]) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++)
            hash += globalContext.hashCode(keywords[i]);

        let program = this.programs[hash];
        if (program == null)
        {
            let fragmentShader = globalContext.compileShader(globalContext.gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
            program = globalContext.createProgram(this.vertexShader, fragmentShader);
            this.programs[hash] = program;
        }

        if (program == this.activeProgram) return;

        this.uniforms = globalContext.getUniforms(program);
        this.activeProgram = program;
    }

    bind () {
        globalContext.gl.useProgram(this.activeProgram);
    }
}