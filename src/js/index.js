import { projectInitialization } from "./three/root"
import { checkRendererAspect } from "./three/responsive"
import { initializeSimulation } from "./simulation"
import { initializeGUI } from "./simulation/gui"

const { renderer, scene, camera } = projectInitialization()
const simulation = initializeSimulation({ camera })
scene.add(simulation.root)
// TODO: После очистки почему-то появляется шаблон подсказки
// TODO: Обработать случай, когда шаблон выходит за рамки поля
// TODO: Немного поиграться со стилями шаблона
// TODO: Добавить больше шаблонов
initializeGUI({
	templateChangeHandler: simulation.handleHintTemplateChange.bind(simulation),
	stateChangeHandler: simulation.handleStateChange.bind(simulation),
	handleFieldClear: simulation.clearField.bind(simulation)
})

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
