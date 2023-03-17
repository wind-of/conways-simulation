import { projectInitialization } from "./three/root"
import { checkRendererAspect } from "./three/responsive"
import { initializeSimulation } from "./simulation"

const { renderer, scene, camera } = projectInitialization()
const simulation = initializeSimulation({ camera })

scene.add(simulation.root)

window.addEventListener("keydown", (event) => simulation.handleKeydown(event))
window.addEventListener("mousemove", (event) => simulation.handleMouseMove(event))
window.addEventListener("mousedown", (event) => simulation.handleMouseDown(event))
window.addEventListener("mouseup", () => simulation.handleMouseUp())

function animate(time) {
	simulation.tick({ time })
	checkRendererAspect(renderer, camera)
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
window.addEventListener("resize", () => checkRendererAspect(renderer, camera))
