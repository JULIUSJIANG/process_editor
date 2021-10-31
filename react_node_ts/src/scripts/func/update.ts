import globalContext from "../GlobalContext";
import applyInputs from "./applyInputs";
import calcDeltaTime from "./calcDeltaTime";
import initFramebuffers from "./initFramebuffers";
import render from "./render";
import resizeCanvas from "./resizeCanvas";
import step from "./step";
import updateColors from "./updateColors";

export default function update () {
    const dt = calcDeltaTime();
    if (resizeCanvas())
        initFramebuffers();
    updateColors(dt);
    applyInputs();
    if (!globalContext.config.PAUSED)
        step(dt);
    render(null);
    requestAnimationFrame(update);
}