import {
  Uniform,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
  HalfFloatType,
  FloatType,
  MeshBasicMaterial,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";

import Common from "../../../Common.js";
import Device from "../../../pure/Device.js";

import AssetsManager from "../../../Managers/AssetsManager.js";
import ShadersManager from "../../../Managers/ShaderManager.js";

import Input from "../../../Input.js";

class waveCursor {
  params = {
    size: 0.7,
    delay: 0.5,
  };

  constructor(outputTarget) {
    this.fbos = {
      targetA: null,
      targetB: null,
    };

    this.output = null;
    this.outputTarget = outputTarget;

    this.init();
  }

  init() {
    const { renderer } = Common.rendererManager;
    const { splash } = Common.sceneManager.scenes;
    const { roomCamera } = Common.cameraManager.cameras;

    this.renderer = renderer;
    this.scene = splash;
    this.camera = roomCamera;

    this.createAllFbos();
    this.initOutput();
  }

  createAllFbos() {
    Object.keys(this.fbos).forEach((key) => {
      this.fbos[key] = new WebGLRenderTarget(512, 512, {
        type: FloatType,
        internalFormat: "RGBA16F",
      });
    });
  }

  initOutput() {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(
        [
          -1,
          -1,
          0, // Bottom-left corner
          3,
          -1,
          0, // Bottom-right corner (overshoot for full coverage)
          -1,
          3,
          0, // Top-left corner (overshoot for full coverage)
        ],
        3,
      ),
    );

    this.output = new Mesh(
      geometry,
      new ShaderMaterial({
        uniforms: {
          uTime: new Uniform(0),
          tBuffer: new Uniform(this.fbos.targetA.texture),
          tAdvect: new Uniform(AssetsManager.items.advect),
          uSplatCoords: new Uniform(new Vector2()),
          uPrevSplatCoords: new Uniform(new Vector2()),
          uSplatRadius: new Uniform(1),
          uResolution: new Uniform(
            new Vector2(
              Device.viewport.width,
              Device.viewport.height,
            ).multiplyScalar(Device.pixelRatio),
          ),
          uSizeXFactor: new Uniform(this.params.size),
          uDelay: new Uniform(this.params.delay),
        },
        vertexShader: `
          varying vec2 vUv;

          void main() {
            // Directly set the vertex positions in clip space
          
            gl_Position = vec4(position, 1.0);
            vUv = position.xy * 0.5
              + 0.5; // Convert [0,1] to [0,1]
          }
        `,
        fragmentShader: ShadersManager.get(
          "components",
          "waveCursor",
          "fragment",
        ),
      }),
    );

    this.output.rotateX(-Math.PI / 2);

    this.addScene();
  }

  addScene() {
    this.scene.add(this.output);
  }

  dispose() {}

  render(t) {
    this.output.material.uniforms.uTime.value = t * 0.001;
    this.output.material.uniforms.uSplatCoords.value.copy(Input.coords);
    this.output.material.uniforms.uPrevSplatCoords.value.copy(Input.prevCoords);
    this.output.material.uniforms.uSplatRadius.value = Input.mouseVelocity;

    this.renderer.setRenderTarget(this.fbos.targetA);
    this.renderer.render(this.scene, this.camera);

    this.output.material.uniforms.tBuffer.value = this.fbos.targetA.texture;
    this.outputTarget.texture = this.fbos.targetA.texture;

    this.renderer.setRenderTarget(null);

    const target = this.fbos.targetA;
    this.fbos.targetA = this.fbos.targetB;
    this.fbos.targetB = target;
  }

  resize() {
    this.output.material.uniforms.uResolution.value.set(
      Device.viewport.width * Device.pixelRatio,
      Device.viewport.height * Device.pixelRatio,
    );
  }

  debug(debug, Options) {
    const { debug: pane } = this;

    const folder = Options;

    folder.addBinding(this.output.material.uniforms.uSizeXFactor, "value", {
      label: "Size X Factor",
      min: 0,
      max: 2,
      step: 0.01,
    });

    folder.addBinding(this.output.material.uniforms.uDelay, "value", {
      label: "Delay",
      min: 0,
      max: 2,
      step: 0.01,
    });
  }
}

export default waveCursor;
