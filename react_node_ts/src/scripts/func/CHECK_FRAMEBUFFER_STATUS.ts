import globalContext from "../GlobalContext";

export default function CHECK_FRAMEBUFFER_STATUS() {
    let status = globalContext.gl.checkFramebufferStatus(globalContext.gl.FRAMEBUFFER);
    if (status != globalContext.gl.FRAMEBUFFER_COMPLETE)
        console.trace("Framebuffer error: " + status);
}