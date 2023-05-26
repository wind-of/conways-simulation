import { projectInitialization } from "./project/root"
import { checkRendererAspect } from "./project/responsive"
import { randomMatrix } from "./utils"
import { DEFAULT_ITERATION_PER_SECOND, DEFAULT_ITERATION_PER_TIME } from "./gui.constants"
import THREE = require("three")

const canvas = document.getElementById("simulation") as HTMLCanvasElement
const { renderer, scene, camera } = projectInitialization({ canvas })
const simulationArguments = (offset = [0, 0, 0], size = 30) => ({
	camera,
	settings: {
		iterationsPerSecond: DEFAULT_ITERATION_PER_SECOND,
		iterationsPerTime: DEFAULT_ITERATION_PER_TIME,
		matrix: randomMatrix(size),
		matrixSize: size,
		offset: new THREE.Vector3(...offset)
	}
})

const simulations = []
const size = 30

// FIRST
// for(let i = 0; i < 5; i++) {
// 	const simulation = initializeSimulation(simulationArguments([size * i, 0, size * i], size))
// 	simulations.push(simulation)
// }
// SECOND
// const set1 = (i: number, j: number) => [(size / 2) * (i + j), 0, (size / 2) * (i - j)]
// for(let i = 0; i < 5; i += 2)
// 	for(let j = 0; j < 5; j += 2) {
// 		const simulation = initializeSimulation(simulationArguments(set1(i, j), size)) 
// 		simulations.push(simulation)
// 	}
// THIRD
// const s1 = initializeSimulation(simulationArguments([0, 0, 0], size)) 
// const s2 = initializeSimulation(simulationArguments([0, size, 0], size)) 
// const s3 = initializeSimulation(simulationArguments([-size / 2, size / 2, 0], size)) 
// const s4 = initializeSimulation(simulationArguments([size / 2, size / 2, 0], size)) 
// const s5 = initializeSimulation(simulationArguments([0, size / 2, -size / 2], size)) 
// const s6 = initializeSimulation(simulationArguments([0, size / 2, size / 2], size)) 
// s3.root.rotateZ(Math.PI / 2)
// s4.root.rotateZ(Math.PI / 2)
// s5.root.rotateX(Math.PI / 2)
// s6.root.rotateX(Math.PI / 2)
// simulations.push(s1, s2, s3, s4, s5, s6)

simulations.forEach((s) => {
	s.toggleIterationState()
	scene.add(s.root)
})

// initializeGUI({
// 	templateChangeHandler: simulation.handleHintTemplateChange.bind(simulation),
// 	stateChangeHandler: simulation.handleStateChange.bind(simulation),
// 	handleFieldClear: simulation.clearField.bind(simulation),
// 	handleFieldCopy: ({ shouldReduce }) => {
// 		const matrix = shouldReduce ? reduceMatrix(simulation.field.matrix) : simulation.field.matrix
// 		const string = encodeMatrixToTemplateString(matrix)
// 		navigator.clipboard.writeText(string)
// 	},
// 	handleRulesChange: simulation.updateRulesFunction.bind(simulation),
// 	handleIterationsPerSecondChange: simulation.settings.setIterationsPerSecond.bind(
// 		simulation.settings
// 	),
// 	handleIterationsPerTimeChange: simulation.settings.setIterationsPerTime.bind(simulation.settings),
// 	handleSimulationStateChange: simulation.toggleIterationState.bind(simulation)
// })

// window.addEventListener(
// 	"keydown",
// 	({ key }) => key === SPACE_KEY && simulation.toggleIterationState()
// )
// window.addEventListener(
// 	"mousemove",
// 	(event) => event.target === canvas && simulation.handleMouseMove(event)
// )
// window.addEventListener(
// 	"mousedown",
// 	(event) => event.target === canvas && simulation.handleMouseDown(event)
// )
// window.addEventListener("mouseup", () => simulation.handleMouseUp())

function animate(time: number) {
	simulations.forEach((s) => s.tick({ time }))
	// simulation.tick({ time })
	checkRendererAspect(renderer, camera)
	renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
window.addEventListener("resize", () => checkRendererAspect(renderer, camera))
