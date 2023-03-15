import * as THREE from "three"
import { projectInitialization } from "./three/root"
import { checkRendererAspect } from "./three/responsive"
import { gameGridPlaneMesh } from "./three/meshes/plane"
import { createGridMesh } from "./three/grid"

import { DEFAULT_MATRIX_SIZE } from "./constants"
import { initializeSimulation } from "./simulation"
import { initializeRaycaster } from "./three/raycaster"

const { renderer, scene, camera } = projectInitialization()
const ROOT = new THREE.Object3D()
const planeMesh = gameGridPlaneMesh(DEFAULT_MATRIX_SIZE)
const raycaster = initializeRaycaster({ object: planeMesh, camera })
const simulation = initializeSimulation({ root: ROOT, raycaster })
const { field } = simulation

scene.add(ROOT)
ROOT.add(planeMesh, ...createGridMesh(planeMesh))
field.display()

window.addEventListener("keydown", (event) => simulation.handleKeydown(event))
window.addEventListener("mousemove", (event) => simulation.handleMouseMove(event))
window.addEventListener("mousedown", () => simulation.handleMouseDown())
window.addEventListener("mouseup", () => simulation.handleMouseUp())

function animate(time) {
	simulation.tick({ time })
	checkRendererAspect(renderer, camera)
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
window.addEventListener("resize", () => checkRendererAspect(renderer, camera))
