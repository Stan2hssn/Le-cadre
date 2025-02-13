import { Group, WebGLRenderTarget, FloatType } from "three";

import Common from "../Common";

import Room from "./props/Room";
import Stars from "./props/Stars";
import waveCursor from "./props/waveCursor";

export default class {
  props = {};

  constructor() {
    this.init();
  }

  init() {
    this.setupRenderTarget();
    this.propsGroup = new Group();

    this.props.Cursor = new waveCursor(waveCursor);
    this.props.Room = new Room(this.targets.waveCursor);
    this.props.Stars = new Stars();

    Object.keys(this.props).forEach((key) => {
      if (!this.props[key].mesh) return;
      this.propsGroup.add(this.props[key].mesh);
    });

    Common.sceneManager.scenes.room.add(this.propsGroup);
  }

  setupRenderTarget() {
    this.targets = {
      waveCursor: new WebGLRenderTarget(512, 512, {
        type: FloatType,
        internalFormat: "RGBA16F",
      }),
    };
  }

  dispose() {}

  render(t) {
    this.props.Cursor.render(t);
    this.props.Stars.render(t);
    this.props.Room.render(t, this.targets.waveCursor.texture);
  }

  resize() {
    Object.keys(this.props).forEach((key) => {
      if (typeof this.props[key].resize === "function") {
        this.props[key].resize();
      }
    });
  }

  debug(pane) {
    const Options = pane.addFolder({
      title: "Options",
      expanded: true,
    });

    Object.keys(this.props).forEach((key) => {
      if (typeof this.props[key].debug === "function") {
        this.props[key].debug(pane, Options);
      }
    });
  }
}
