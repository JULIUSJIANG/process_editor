import globalContext from "../GlobalContext";

export default function calcDeltaTime () {
    let now = Date.now();
    let dt = (now - globalContext.lastUpdateTime) / 1000;
    dt = Math.min(dt, 0.016666);
    globalContext.lastUpdateTime = now;
    return dt;
}