import { TextureLoader } from "three";

class AssetsManager {
  constructor() {
    this.items = {};

    this.imageLoader = new TextureLoader();
    this.library = {
      Images: {
        Normal: {},
        Diffuse: {},
        Maps: {},
        BW: {},
        Helpers: {
          checkerUV: this.imageLoader.load("/Images/Helpers/checkerUV.jpg"),
          gradient: this.imageLoader.load("/Images/Helpers/gradient.jpg"),
        },
        Procedural: {},
      },
      Videos: {},
    };

    this.getAllAssets();
  }

  get(key) {
    return this.items[key];
  }

  getAllAssets() {
    Object.keys(this.library.Images).forEach((category) => {
      const images = this.library.Images[category];
      Object.keys(images).forEach((imageKey) => {
        let newKey = imageKey;
        while (this.items[newKey]) {
          newKey = `${imageKey}_${Math.random().toString(36).substr(2, 9)}`;

          console.error(
            `Key ${imageKey} already exists in the items object` +
              `it was renamed with value ${newKey}`,
          );
        }
        images[newKey] = images[imageKey];
        images[newKey].wrapS = images[newKey].wrapT = 1000;
        this.items[newKey] = images[newKey];

        images[imageKey].wrapS = images[imageKey].wrapT = 1000;
        this.items[imageKey] = images[imageKey];
      });
    });

    return this.library;
  }
}

export default new AssetsManager();
