import { projectInitialization } from "./three/root"
import { checkRendererAspect } from "./three/responsive"
import { initializeSimulation } from "./simulation/simulation"
import { initializeGUI } from "./gui"
import { encodeMatrixToLifeString } from "./life"
import { reduceMatrix } from "./utils"
import { SPACE_KEY } from "./constants/general"
import { DEFAULT_ITERATION_PER_SECOND, DEFAULT_ITERATION_PER_TIME } from "./gui.constants"

const canvas = document.getElementById("simulation")
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
		const string = encodeMatrixToLifeString(matrix)
		navigator.clipboard.writeText(string)
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

function animate(time) {
	simulation.tick({ time })
	checkRendererAspect(renderer, camera)
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
window.addEventListener("resize", () => checkRendererAspect(renderer, camera))
