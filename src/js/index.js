import * as THREE from "three"
import { projectInitialization, fullyTerminateMesh, cloneMesh } from "./three/root"
import { checkRendererAspect } from "./three/responsive"
import { aliveCellMesh } from "./three/meshes/cell"
import { gameGridPlaneMesh } from "./three/meshes/plane"
import { createGridMesh } from "./three/grid"
import { normalizedRaycasterObjectPosition } from "./three/coordinates"

import { DEFAULT_MATRIX_SIZE, SPACE_KEY } from "./constants"
import { initializeSimulation } from "./simulation"
import { initializeRaycaster } from "./three/raycaster"

const { renderer, scene, camera } = projectInitialization()
const ROOT = new THREE.Object3D()
const planeMesh = gameGridPlaneMesh(DEFAULT_MATRIX_SIZE)
const simulation = initializeSimulation(ROOT)
const raycaster = initializeRaycaster({ object: planeMesh, camera })
const { field } = simulation

scene.add(ROOT)
ROOT.add(planeMesh, ...createGridMesh(planeMesh))
field.display()

window.addEventListener("keydown", ({ key }) => {
	if (key === SPACE_KEY) {
		simulation.toggleIteration()
		field.setHintVisibility(!simulation.isIterating)
	}
})

window.addEventListener("mousemove", ({ clientX, clientY }) => {
	raycaster.setMousePosition({ x: clientX, y: clientY })
	const intersectedCell = raycaster.getIntersectedCell()
	if (!intersectedCell || simulation.isIterating) {
		field.setHintVisibility(false)
		return
	}
	field.setHintsDefaultState()

	const targetPosition = normalizedRaycasterObjectPosition({ object: intersectedCell })
	const isTargetAlive = field.isAlive(targetPosition)
	field.setHintPosition(targetPosition)

	if (isTargetAlive) {
		field.setHintsTerminationState()
	}
})

window.addEventListener("mousedown", function () {
	if (simulation.isIterating || !raycaster.hasIntersectedCell()) {
		return
	}
	const position = normalizedRaycasterObjectPosition({ object: raycaster.getIntersectedCell() })
	const mesh = field.getObject(position)

	if (mesh) {
		fullyTerminateMesh(ROOT, mesh)
		field.kill(position)
		field.removeObject(position)
	} else {
		const aliveCell = cloneMesh(aliveCellMesh, position)
		field.revive(position)
		field.saveObject(aliveCell)
		ROOT.add(aliveCell)
	}
})

function animate(time) {
	if (simulation.isIterating) {
		simulation.iterate({ time })
	} else {
		field.animateHint({ time })
	}

	checkRendererAspect(renderer, camera)
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
window.addEventListener("resize", () => checkRendererAspect(renderer, camera))
