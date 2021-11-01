import globalContext from "../GlobalContext";

export default function updateKeywords () {
    let displayKeywords = [];
    if (globalContext.config.SHADING) displayKeywords.push("SHADING");
    if (globalContext.config.BLOOM) displayKeywords.push("BLOOM");
    if (globalContext.config.SUNRAYS) displayKeywords.push("SUNRAYS");
    globalContext.displayMaterial.setKeywords(displayKeywords);
}