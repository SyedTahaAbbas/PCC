import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.1.0/src/Shox.js"

export const UPDATE_VERT = `
	precision mediump float;

	uniform float uTimeDelta;
	uniform float uTime;
	uniform vec2 uRandom;

	in vec2 aPosition;
	in float aAge;
	in float aLife;
	in vec2 aVel;
	in vec3 aColor;

	out vec2 vPosition;
	out float vAge;
	out float vLife;
	out vec2 vVel;
	out vec3 vColor;

	${Shox.noiseMath}
	${Shox.snoise3D}
	${Shox.hash}

	void main() {
		vec2 noise = vec2(
			.5+.5*snoise(vec3(vec2(aPosition*10.+200.), uTime*.5)),
			.5+.5*snoise(vec3(vec2(aPosition*10.+100.), uTime*.5))
		);

		if (aAge >= aLife) {
			ivec2 coord = ivec2(gl_VertexID%512, gl_VertexID/512);
			vec2 rand = hash22(vec2(coord));
			float posX = snoise(vec3(rand+vec2(uRandom.x), -uTime*.1+noise.x*.1));
			float posY = snoise(vec3(rand-vec2(uRandom.y),  uTime*.1+noise.y*.1));
			vPosition = .75*vec2(posX, posY);
			vAge = 0.;
			vLife = aLife;
			vVel = vPosition;
			vColor = aColor;
		} else {
			vec2 force = 3.*(2.*noise.rg-1.);
			vPosition = aPosition+aVel*uTimeDelta;
			vAge = aAge+uTimeDelta;
			vLife = aLife;
			vVel = .95*aVel+force*uTimeDelta*3.;
			vColor = aColor;
		}
	}
`

export const UPDATE_FRAG = `
	precision mediump float;
	in float vAge;
	void main() { discard; }
`

export const RENDER_VERT = `
	precision mediump float;

	in vec4 aPosition;
	in float aAge;
	in float aLife;
	in vec3 aColor;

	out vec4 vPosition;
	out float vAge;
	out float vLife;
	out vec3 vColor;

	void main() {
		vPosition = aPosition;
		vAge = aAge;
		vLife = aLife;
		vColor = aColor;
		gl_PointSize = 1.*(1.-aAge/aLife);
		gl_Position = aPosition;

	}
`

export const RENDER_FRAG = `
	precision mediump float;

	in float vAge;
	in float vLife;
	in vec3 vColor;

	out vec4 fragColor;
	void main() {
		fragColor = vec4(vColor,1.0);
	}
`
