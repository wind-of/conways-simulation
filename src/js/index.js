import * as THREE from "three"
import { projectInitialization, cloneMesh } from "./three/root"
import { checkRendererAspect } from "./three/responsive"
import { aliveCellFactory } from "./three/meshes/alive-cell"
import { gameGridPlaneMesh } from "./three/meshes/plane"
import { highlightOpacityAnimation } from "./three/animation"

import { createGridMesh } from "./three/grid";
import { DEFAULT_MATRIX_SIZE, NO_INTERSECTED_CELL, DEFAULT_Y_POSITION, SPACE_KEY } from "./constants"
import { initializeSimulation } from "./simulation"

const { renderer, scene, camera } = projectInitialization()
const simulation = initializeSimulation()
const { field } = simulation

const ROOT = new THREE.Object3D()
scene.add(ROOT)

const planeMesh = gameGridPlaneMesh(DEFAULT_MATRIX_SIZE)
ROOT.add(planeMesh, ...createGridMesh(planeMesh))

const highlightMesh = aliveCellFactory()
highlightMesh.material.visible = false
ROOT.add(highlightMesh)

const mousePosition = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let intersectedCell = NO_INTERSECTED_CELL

window.addEventListener("keydown", ({ key }) => {
	if(key === SPACE_KEY) simulation.isIterating = !simulation.isIterating
})

window.addEventListener("mousemove", ({ clientX, clientY }) => {
	mousePosition.x = (clientX / window.innerWidth) * 2 - 1
	mousePosition.y = -(clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(mousePosition, camera)
	intersectedCell = raycaster.intersectObject(planeMesh)[0]
	if(!intersectedCell || simulation.isIterating) {
		highlightMesh.material.visible = false
		return
	}

	const highlightPos = new THREE.Vector3().copy(intersectedCell.point).floor().addScalar(0.5);
	const isCurrentCellAlive = field.isAlive(highlightPos)
	highlightMesh.material.visible = !isCurrentCellAlive
	intersectedCell = isCurrentCellAlive ? NO_INTERSECTED_CELL : intersectedCell
	if(!isCurrentCellAlive) { 
		highlightMesh.position.set(highlightPos.x, DEFAULT_Y_POSITION, highlightPos.z)
	}
});

const aliveCellMesh = aliveCellFactory() 
field.display(ROOT, aliveCellMesh)

window.addEventListener("mousedown", function() {
	if(field.isAlive(highlightMesh.position) || !intersectedCell || simulation.isIterating) {
		return
	}

	const aliveCell = cloneMesh(aliveCellMesh, highlightMesh.position);
	field.revive(highlightMesh.position)
	field.saveObject(aliveCell)
	ROOT.add(aliveCell)
});

function animate(time) {
	if(simulation.isIterating && simulation.shouldIterateAtTime({ time })) {
		simulation.iteration++
		const matrix = field.matrix
		for(let x = 0; x < matrix.length; x++)
			for(let z = 0; z < matrix[x].length; z++)
				field.iterate({ x, z })
		field.applyChanges()
		field.display(ROOT, aliveCellMesh)
	} else {
		highlightMesh.material.opacity = highlightOpacityAnimation(time)
	}

	checkRendererAspect(renderer, camera)
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
window.addEventListener("resize", () => checkRendererAspect(renderer, camera))
