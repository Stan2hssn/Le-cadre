import * as THREE from "three";
import Common from "../../Common";

export default class {
  params = {
    sceneColor: Common.params.sceneColor,
  };

  constructor() {
    this.init();
  }

  init() {
    const geometry = new THREE.BufferGeometry();

    const vertices = [];

    const material = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      alphaTest: 0.5,
      transparent: true,
    });

    this.stars = new THREE.Points(geometry, material);

    for (let i = 0; i < 10000; i++) {
      const x = 100 * Math.random() - 50;
      const y = 2 * Math.random() - 3;
      const z = 100 * Math.random() - 50;

      vertices.push(x, y, z);
    }

    this.stars.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );

    Common.sceneManager.scenes.main.add(this.stars);
  }

  dispose() {}

  render(t) {}

  resize() {}

  debug(debug, folder) {}
}
