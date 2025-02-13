import { Scene, Color } from "three";

class SceneManager {
  constructor(params) {
    this.params = params;
    this.scenes = {
      main: new Scene(),
      room: new Scene(),
      splash: new Scene(),
    };

    this.scenes.main.background = new Color(this.params.sceneColor);
    this.scenes.room.background = new Color(this.params.sceneColor);
  }
}

export default SceneManager;
