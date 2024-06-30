import { UPDATE_VERT, UPDATE_FRAG } from "./shaderSource.js"
import { RENDER_VERT, RENDER_FRAG } from "./shaderSource.js"
import Olon, { Data } from "https://cdn.jsdelivr.net/npm/olon@0.0.0/src/Olon.js"
import { random, floor, min } from "./tools.js"

const MAX_AMOUNT = 10000
const MIN_AGE = 1.01
const MAX_AGE = 2.15
const BIRTH_RATE = 0.5

const ol = Olon(720, 720)
ol.enableCanvas2D()

ol.blend({
	sfactor: ol.SRC_ALPHA,
	dfactor: ol.ONE_MINUS_SRC_ALPHA,
})
ol.enableBlend()

const TFV = ["vPosition", "vAge", "vLife", "vVel"]
const updateProgram = ol.createProgram(UPDATE_VERT, UPDATE_FRAG, TFV)
const renderProgram = ol.createProgram(RENDER_VERT, RENDER_FRAG)

const aPosition = { name: "aPosition", unit: "f32", size: 2 }
const aAge = { name: "aAge", unit: "f32", size: 1 }
const aLife = { name: "aLife", unit: "f32", size: 1 }
const aVel = { name: "aVel", unit: "f32", size: 2 }
const attributes = [aPosition, aAge, aLife, aVel]

const particleData = []
for (let i = 0; i < MAX_AMOUNT; i++) {
	const life = random(MIN_AGE, MAX_AGE)
	particleData.push(0, 0) // aPosition
	particleData.push(life + 1) // aAge
	particleData.push(life) // aLife
	particleData.push(0, 0) // aVel
}
const initData = Data(particleData)

const buffer0 = ol.createBuffer(initData, ol.STREAM_DRAW)
const buffer1 = ol.createBuffer(initData, ol.STREAM_DRAW)

const vao0 = ol.createVAO(updateProgram, {
	buffer: buffer0,
	stride: 4 * 6,
	attributes,
})
const vao1 = ol.createVAO(updateProgram, {
	buffer: buffer1,
	stride: 4 * 6,
	attributes,
})

const buffers = [buffer0, buffer1]
const vaos = [vao0, vao1]
let [read, write] = [0, 1]
let [lastTime, bornAmount] = [0, 0]

ol.uniform("uRandom", [random() * 1024, random() * 1024])

ol.render(() => {
	const time = ol.frame / 60
	const timeDelta = time - lastTime
	lastTime = time

	const nextAmount = floor(bornAmount + BIRTH_RATE * 1000)
	bornAmount = min(MAX_AMOUNT, nextAmount)

	ol.clearColor(0, 0, 0, 0.25)
	ol.clearDepth()

	ol.use({ program: updateProgram }).run(() => {
		ol.transformFeedback(vaos[read], buffers[write], ol.POINTS, () => {
			ol.uniform("uTimeDelta", timeDelta)
			ol.uniform("uTime", time)
			ol.points(0, bornAmount)
		})
	})

	ol.use({
		program: renderProgram,
		VAO: vaos[write],
	}).run(() => ol.points(0, bornAmount))

	// swap
	;[read, write] = [write, read]
})
