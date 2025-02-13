attribute vec3 instanceCenter;

uniform sampler2D tMouse;

uniform mat4 tProjectionMatrixCamera;
uniform mat4 tViewMatrixCamera;

varying vec4 vTexCoords;

varying vec2 vUv;
varying float vWeight;
uniform float uThreshold;

void main() {
    vec3 transformed = position;

    // Position of vertex in world space
    vec4 worldPos = instanceMatrix * vec4(transformed, 1.0);

    vec4 instancePos = instanceMatrix * vec4(instanceCenter * .1, 1.0);
    vec4 tTexCoords = tProjectionMatrixCamera * tViewMatrixCamera * instancePos;
    vec2 winUv = (tTexCoords.xy / tTexCoords.w) * 0.5 + 0.5;

    float mouseWave = texture2D(tMouse, winUv).r;

    // Distance from the instance center to origin (or another point of reference)
    float dist = mouseWave;

    // Compute weight: if distance < threshold, vWeight = 1, else it fades out
    vWeight = dist;

    // Standard projection
    vec4 viewPosition = viewMatrix * worldPos;
    gl_Position = projectionMatrix * viewPosition;

    vUv = uv;
}