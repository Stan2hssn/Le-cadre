import viewVertexShader from "../shaders/composers/view/vertex.glsl";
import viewFragmentShader from "../shaders/composers/view/fragment.glsl";

import defaultVertexShader from "../shaders/components/default/vertex.glsl";
import defaultFragmentShader from "../shaders/components/default/fragment.glsl";

import waveCursorVertexShader from "../shaders/components/waveCursor/face.vert";
import waveCursorFragmentShader from "../shaders/components/waveCursor/color.frag";

const Shaders = {
  composers: {
    view: {
      vertex: viewVertexShader,
      fragment: viewFragmentShader,
    },
  },
  components: {
    default: {
      vertex: defaultVertexShader,
      fragment: defaultFragmentShader,
    },
    waveCursor: {
      vertex: waveCursorVertexShader,
      fragment: waveCursorFragmentShader,
    },
  },
};

class ShadersManager {
  static get(category, name, type) {
    return Shaders[category][name][type];
  }
}

export default ShadersManager;
