uniform float uTime;

uniform vec2 uResolution;

uniform sampler2D tDiffuse;

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;

    vec4 view = texture2D(tDiffuse, st);

    gl_FragColor = view;

    #include <colorspace_fragment>
}