import { WebGLRenderer } from "three";

import Device from "../pure/Device.js";

class RendererManager {
  constructor({ canvas }) {
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: false,
      stencil: false,
      powerPreference: "high-performance",
      antialias: false,
    });

    this.renderer.autoClear = false;
    this.renderer.physicallyCorrectLights = true;
  }

  resize() {
    this.renderer.setSize(Device.viewport.width, Device.viewport.height);
    this.renderer.setPixelRatio(Device.pixelRatio);
  }
}

export default RendererManager;
