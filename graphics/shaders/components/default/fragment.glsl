uniform float uMixer;

uniform vec3 uBackColor;
uniform vec3 uFrontColor;
uniform vec3 uDarkColor;

uniform vec2 uResolution;

uniform sampler2D tDiffuse;
uniform sampler2D tMouse;

varying vec2 vUv;
varying float vWeight;

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    vec4 texel = texture2D(tDiffuse, st);

    vec4 mouse = texture2D(tMouse, st);

    float d = step(.2, length(vUv - .5));

    // Colorize the plane based on vWeight
    vec3 color = mix(uBackColor, uFrontColor, vWeight);
    vec3 stars = mix(vec3(uDarkColor), texel.rgb, vWeight);

    vec3 finalColor = mix(color, stars, uMixer);

    gl_FragColor = vec4(st, 1., 1.0);
    gl_FragColor = texel;
    gl_FragColor = vec4(finalColor, 1.0);
}
