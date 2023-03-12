import * as THREE from "three"
import { projectInitialization, cloneMesh } from "./three/root"
import { checkRendererAspect } from "./three/responsive"
import { aliveCellFactory } from "./three/meshes/alive-cell"
import { gameGridPlaneMesh } from "./three/meshes/plane"
import { highlightOpacityAnimation } from "./three/animation"
import { createGridMesh } from "./three/grid"
import { normalizedRaycasterObjectPosition } from "./three/coordinates"

import { DEFAULT_MATRIX_SIZE, NO_INTERSECTED_CELL, DEFAULT_Y_POSITION, SPACE_KEY } from "./constants"
import { initializeSimulation } from "./simulation"

const { renderer, scene, camera } = projectInitialization()
const ROOT = new THREE.Object3D()
const simulation = initializeSimulation(ROOT)
const { field } = simulation

scene.add(ROOT)

const planeMesh = gameGridPlaneMesh(DEFAULT_MATRIX_SIZE)
ROOT.add(planeMesh, ...createGridMesh(planeMesh))

// TODO: выделить всю логику, связанную с подсвечиваемой клеткой, в единый объект
const highlightMesh = aliveCellFactory()
highlightMesh.material.visible = false
ROOT.add(highlightMesh)

const mousePosition = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let intersectedCell = NO_INTERSECTED_CELL

window.addEventListener("keydown", ({ key }) => {
	if(key === SPACE_KEY) {
		simulation.toggleIteration()
		highlightMesh.material.visible = !simulation.isIterating
	}
})

window.addEventListener("mousemove", ({ clientX, clientY }) => {
	mousePosition.x = (clientX / window.innerWidth) * 2 - 1
	mousePosition.y = -(clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(mousePosition, camera)
	intersectedCell = raycaster.intersectObject(planeMesh)[0]
	highlightMesh.material.visible = false
	if(!intersectedCell || simulation.isIterating) {
		return
	}

	const targetPosition = normalizedRaycasterObjectPosition(intersectedCell)
	const isTargetAlive = field.isAlive(targetPosition)
	highlightMesh.material.visible = !isTargetAlive
	if(!isTargetAlive) { 
		highlightMesh.position.set(targetPosition.x, DEFAULT_Y_POSITION, targetPosition.z)
	}
});

const aliveCellMesh = aliveCellFactory() 
field.display(ROOT, aliveCellMesh)

window.addEventListener("mousedown", function() {
	const position = normalizedRaycasterObjectPosition(intersectedCell)
	if(field.isAlive(position) || simulation.isIterating) {
		return
	}

	const aliveCell = cloneMesh(aliveCellMesh, position);
	field.revive(position)
	field.saveObject(aliveCell)
	ROOT.add(aliveCell)
});

function animate(time) {
	if(simulation.isIterating) {
		simulation.iterate({ time, aliveCellMesh })
	} else {
		highlightMesh.material.opacity = highlightOpacityAnimation(time)
	}

	checkRendererAspect(renderer, camera)
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
window.addEventListener("resize", () => checkRendererAspect(renderer, camera))
