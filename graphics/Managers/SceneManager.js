import { Scene, Color } from "three";

class SceneManager {
  constructor(params) {
    this.params = params;
    this.scenes = {
      main: new Scene(),
    };

    this.scenes.main.background = new Color(this.params.sceneColor);
  }
}

export default SceneManager;
