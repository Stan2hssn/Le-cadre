import Device from "./pure/Device.js";

import { Color } from "three";

import Managers from "./pure/Managers.js";

import { Pane } from "tweakpane";

class Common {
  // create a scene and the parameters for the scene
  params = {
    sceneColor: new Color(0.133, 0.133, 0.133), // Converted to float type
    cameraFov: 50,
    cameraNear: 0.01,
    cameraFar: 100.0,
  };

  constructor() {
    this.managers = {};
    this.render = this.render.bind(this);
  }

  init({ canvas }) {
    this.canvas = canvas;

    this.rendererManager = Managers.RendererManager({ canvas });
    this.cameraManager = Managers.CameraManager(this.params);
    this.sceneManager = Managers.SceneManager(this.params);

    this.cameraManager.setCameras();
  }

  setPane() {
    this.pane = new Pane();
    this.setDebug();
  }

  render(t) {
    this.cameraManager.render(t);
  }

  dispose() {
    this.sceneManager.dispose();
    this.cameraManager.dispose();
    this.rendererManager.dispose();
  }

  resize() {
    const parentElement =
      this.rendererManager.renderer.domElement.parentElement;
    Device.viewport.width = parentElement.offsetWidth;
    Device.viewport.height = parentElement.offsetHeight;
    Device.pixelRatio = window.devicePixelRatio;

    const aspectRatio = Device.viewport.width / Device.viewport.height;
    Device.aspectRatio = aspectRatio;

    this.rendererManager.resize();
    this.cameraManager.resize(aspectRatio);
  }

  setDebug() {}
}

export default new Common();
