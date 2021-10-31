import React from "react";
import { GLContext } from "./struct/GLContext";
import { GLExt } from "./struct/GLExt";
import Global from "./GlobalContext";
export default class Main extends React.Component {
    public override render() {
        return <canvas style={{ width: `100%`, height: `100%` }}></canvas>;
    }
}