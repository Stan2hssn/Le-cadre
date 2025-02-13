import {
  BoxGeometry,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshMatcapMaterial,
  Object3D,
  PlaneGeometry,
  RenderTarget,
  ShaderMaterial,
  TextureLoader,
  Uniform,
  Vector2,
  InstancedBufferAttribute,
  Color,
} from "three";

import ShadersManager from "../../Managers/ShaderManager";

import AssetsManager from "../../Managers/AssetsManager";
import Device from "../../pure/Device";
import Common from "../../Common";

export default class {
  params = {
    count: 100,
    size: 1,
    threshold: 0.5,
    backColor: new Color(0.2, 0.2, 0.8),
    frontColor: new Color(1, 0.5, 0),
    mixer: true,
  };

  constructor(inputTarget) {
    this.renderTarget = new RenderTarget(
      Device.viewport.width * Device.pixelRatio,
      Device.viewport.height * Device.pixelRatio,
    );

    this.inputTarget = inputTarget;

    this.init();
  }

  init() {
    const { roomCamera } = Common.cameraManager.cameras;

    const { count, size } = this.params;

    this.geometry = new PlaneGeometry(size, size, 1, 1);
    this.geometry.rotateX(-Math.PI / 2);
    this.geometry.translate(0.5, 0, 0.5);

    this.material = new ShaderMaterial({
      uniforms: {
        uTime: new Uniform(0),
        tDiffuse: { value: null },
        tMouse: { value: this.inputTarget.texture },

        uBackColor: new Uniform(this.params.backColor),
        uFrontColor: new Uniform(this.params.frontColor),
        uDarkColor: new Uniform(new Color(Common.params.sceneColor)),

        uResolution: new Uniform(new Vector2(0, 0)),

        uThreshold: { value: this.params.threshold },

        // Camera
        tViewMatrixCamera: new Uniform(roomCamera.matrixWorldInverse.clone()),
        tProjectionMatrixCamera: new Uniform(
          roomCamera.projectionMatrix.clone(),
        ),

        uMixer: { value: this.params.mixer },
      },
      vertexShader: ShadersManager.get("components", "default", "vertex"),
      fragmentShader: ShadersManager.get("components", "default", "fragment"),
    });

    this.mesh = new InstancedMesh(
      this.geometry,
      this.material,
      Math.round(count * count),
    );

    const dummy = new Object3D();

    const instanceCenter = new Float32Array(count * count * 3);

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const index = i * count + j;

        dummy.position.set((i - count / 2) * size, 0, (j - count / 2) * size);
        dummy.updateMatrix();
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

        instanceCenter.set(
          [dummy.position.x, dummy.position.y, dummy.position.z],
          index * 3,
        );

        this.mesh.setMatrixAt(index, dummy.matrix);
      }
    }

    this.mesh.geometry.setAttribute(
      "instanceCenter",
      new InstancedBufferAttribute(instanceCenter, 3),
    );

    this.mesh.geometry.setAttribute(
      "instanceCenter",
      new InstancedBufferAttribute(instanceCenter, 3),
    );

    this.mesh.instanceMatrix.needsUpdate = true;

    this.mesh.frustumCulled = false;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }

  render(t, target) {
    const { renderer } = Common.rendererManager;
    const { main, room, splash } = Common.sceneManager.scenes;
    const { mainCamera, roomCamera } = Common.cameraManager.cameras;

    renderer.setRenderTarget(this.inputTarget);
    renderer.render(splash, mainCamera);

    this.material.uniforms.tMouse.value = this.inputTarget.texture;

    this.material.uniforms.uTime.value = t * 0.001;

    renderer.setRenderTarget(this.renderTarget);
    renderer.render(main, mainCamera);

    this.material.uniforms.tDiffuse.value = this.renderTarget.texture;

    renderer.setRenderTarget(null);
    renderer.render(room, roomCamera);
  }

  resize() {
    this.material.uniforms.uResolution.value.set(
      Device.viewport.width * Device.pixelRatio,
      Device.viewport.height * Device.pixelRatio,
    );

    this.inputTarget.setSize(
      Device.viewport.width * Device.pixelRatio,
      Device.viewport.height * Device.pixelRatio,
    );

    this.material.uniforms.tViewMatrixCamera.value =
      Common.cameraManager.cameras.roomCamera.matrixWorldInverse.clone();
    this.material.uniforms.tProjectionMatrixCamera.value =
      Common.cameraManager.cameras.roomCamera.projectionMatrix.clone();
  }

  debug(debug, Options) {
    const { debug: pane } = this;

    const folder = Options;

    folder
      .addBinding(Common.params, "sceneColor", {
        label: "Scene Color",
        color: { type: "float" },
      })
      .on("change", (value) => {
        Common.sceneManager.scenes.main.background = Common.params.sceneColor;
        this.material.uniforms.uDarkColor.value = Common.params.sceneColor;
      });

    folder
      .addBinding(this.params, "mixer", {
        label: "isStars",
      })
      .on("change", (value) => {
        this.material.uniforms.uMixer.value = this.params.mixer;
      });

    folder
      .addBinding(this.params, "size", {
        label: "Size",
        min: 0.1,
        max: 3,
        step: 0.1,
      })
      .on("change", (value) => {
        if (this.mesh) {
          const { count, size } = this.params;

          this.mesh.count = Math.round(count * count);

          const dummy = new Object3D();

          const instanceCenter = new Float32Array(
            this.params.count * this.params.count * 3,
          );

          for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
              const index = i * count + j;

              dummy.position.set(
                (i - count / 2) * size,
                0,
                (j - count / 2) * size,
              );

              dummy.scale.set(size, 1, size);
              dummy.updateMatrix();
              dummy.matrix.decompose(
                dummy.position,
                dummy.quaternion,
                dummy.scale,
              );

              instanceCenter.set(
                [dummy.position.x, dummy.position.y, dummy.position.z],
                index * 3,
              );

              this.mesh.setMatrixAt(index, dummy.matrix);
            }
          }

          this.mesh.geometry.setAttribute(
            "instanceCenter",
            new InstancedBufferAttribute(instanceCenter, 3),
          );

          this.mesh.geometry.setAttribute(
            "instanceCenter",
            new InstancedBufferAttribute(instanceCenter, 3),
          );

          this.mesh.instanceMatrix.needsUpdate = true;
        }
      });

    folder
      .addBinding(this.params, "threshold", {
        label: "Threshold",
        min: 0,
        max: 20,
      })
      .on("change", (value) => {
        this.material.uniforms.uThreshold.value = this.params.threshold;
      });

    folder
      .addBinding(this.params, "backColor", {
        label: "Background Color",
        color: { type: "float" },
      })
      .on("change", (value) => {
        this.material.uniforms.uBackColor.value = this.params.backColor;
      });

    folder
      .addBinding(this.params, "frontColor", {
        label: "Cursor Color",
        color: { type: "float" },
      })
      .on("change", (value) => {
        this.material.uniforms.uFrontColor.value = this.params.frontColor;
      });
  }
}
