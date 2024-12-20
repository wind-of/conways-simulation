import { projectInitialization } from "./project/root"
import { checkRendererAspect } from "./project/responsive"
import { initializeSimulation } from "./simulation"
import { initializeGUI } from "./gui"
import { encodeMatrixToTemplateString } from "./meta/parser"
import { matrixToRLEFormat, reduceMatrix } from "./utils"
import { SPACE_KEY } from "./constants/general"
import { DEFAULT_ITERATION_PER_SECOND, DEFAULT_ITERATION_PER_TIME } from "./gui.constants"

const canvas = document.getElementById("simulation") as HTMLCanvasElement
const { renderer, scene, camera } = projectInitialization({ canvas })
const simulation = initializeSimulation({
	camera,
	settings: {
		iterationsPerSecond: DEFAULT_ITERATION_PER_SECOND,
		iterationsPerTime: DEFAULT_ITERATION_PER_TIME
	}
})
scene.add(simulation.root)

initializeGUI({
	templateChangeHandler: simulation.handleHintTemplateChange.bind(simulation),
	stateChangeHandler: simulation.handleStateChange.bind(simulation),
	handleFieldClear: simulation.clearField.bind(simulation),
	handleFieldCopy: ({ shouldReduce }) => {
		const matrix = shouldReduce ? reduceMatrix(simulation.field.matrix) : simulation.field.matrix
		const string = encodeMatrixToTemplateString(matrix)
		const RLEFormat = matrixToRLEFormat({ string, width: matrix.length, height: matrix[0].length })
		navigator.clipboard.writeText(RLEFormat)
	},
	handleRulesChange: simulation.updateRulesFunction.bind(simulation),
	handleIterationsPerSecondChange: simulation.settings.setIterationsPerSecond.bind(
		simulation.settings
	),
	handleIterationsPerTimeChange: simulation.settings.setIterationsPerTime.bind(simulation.settings),
	handleSimulationStateChange: simulation.toggleIterationState.bind(simulation)
})

window.addEventListener(
	"keydown",
	({ key }) => key === SPACE_KEY && simulation.toggleIterationState()
)
window.addEventListener(
	"mousemove",
	(event) => event.target === canvas && simulation.handleMouseMove(event)
)
window.addEventListener(
	"mousedown",
	(event) => event.target === canvas && simulation.handleMouseDown(event)
)
window.addEventListener("mouseup", () => simulation.handleMouseUp())

function animate(time: number) {
	simulation.tick({ time })
	checkRendererAspect(renderer, camera)
	renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
window.addEventListener("resize", () => checkRendererAspect(renderer, camera))
