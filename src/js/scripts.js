import * as THREE from "three"
import { aliveCellFactory, horizontalPlaneMesh, initialization, highlightOpacityFunction, checkRendererAspect, initializeFieldControls, cloneMesh, displayField } from "./helpers"
import { createGridMesh } from "./grid";

const { renderer, scene, camera } = initialization()
const ITERATION_PER_SECOND = 10
const MATRIX_SIZE = 100
const field = initializeFieldControls(MATRIX_SIZE)

let isIterating = true
let iteration = 0

const planeMesh = horizontalPlaneMesh({ 
	height: MATRIX_SIZE, 
	width: MATRIX_SIZE, 
	material: {
		side: THREE.DoubleSide,
		visible: false
	}
})
scene.add(planeMesh)
scene.add(...createGridMesh(planeMesh))

const highlightMesh = aliveCellFactory()
highlightMesh.material.visible = false
scene.add(highlightMesh)

const mousePosition = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let intersectedCell = null

window.addEventListener("mousemove", ({ clientX, clientY }) => {
	mousePosition.x = (clientX / window.innerWidth) * 2 - 1
	mousePosition.y = -(clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(mousePosition, camera)
	intersectedCell = raycaster.intersectObject(planeMesh)[0]

	if(!intersectedCell || isIterating) {
		highlightMesh.material.visible = false
		return 
	}

	const highlightPos = new THREE.Vector3().copy(intersectedCell.point).floor().addScalar(0.5);
	const isCurrentCellAlive = field.isAlive(highlightPos)
	highlightMesh.material.visible = !isCurrentCellAlive
	intersectedCell = isCurrentCellAlive ? null : intersectedCell
	if(!isCurrentCellAlive) { 
		highlightMesh.position.set(highlightPos.x, 0, highlightPos.z)
	}
});

const aliveCellMesh = aliveCellFactory() 
displayField(scene, field, aliveCellMesh)

window.addEventListener("mousedown", function() {
	if(field.isAlive(highlightMesh.position) || !intersectedCell || isIterating) {
		return
	}

	const aliveCell = cloneMesh(aliveCellMesh, highlightMesh.position);
	field.revive(highlightMesh.position)
	field.saveObject(aliveCell)
	scene.add(aliveCell)
});

function animate(time) {
	if(isIterating && iteration < time / (1000 / ITERATION_PER_SECOND) | 0) {
		iteration++
		const matrix = field.matrix
		for(let x = 0; x < matrix.length; x++)
			for(let z = 0; z < matrix[x].length; z++)
				field.iterate({ x, z })
		field.applyChanges()
		displayField(scene, field, aliveCellMesh)
	} else {
		highlightMesh.material.opacity = highlightOpacityFunction(time)
	}

	checkRendererAspect(renderer, camera)
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
window.addEventListener("resize", () => checkRendererAspect(renderer, camera))
