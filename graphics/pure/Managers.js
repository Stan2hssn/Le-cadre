import SceneManager from "../managers/SceneManager.js";
import RendererManager from "../managers/RendererManager.js";
import CameraManager from "../managers/CameraManager.js";

const Managers = {
  RendererManager: ({ canvas }) => new RendererManager({ canvas }),
  SceneManager: (params) => new SceneManager(params),
  CameraManager: (params) => new CameraManager(params),
};

export default Managers;
