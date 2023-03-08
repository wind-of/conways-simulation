import * as THREE from "three"
import { aliveCellFactory, horizontalPlaneMesh, initialization, highlightOpacityFunction, checkRendererAspect, initializeFieldControls, cloneMesh } from "./helpers"
import { createGridMesh } from "./grid";

const { renderer, scene, camera } = initialization()
const matrixSize = 20
const field = initializeFieldControls(matrixSize)

let isIterating = false
let iteration = 0

const planeMesh = horizontalPlaneMesh({ 
	height: matrixSize, 
	width: matrixSize, 
	material: {
		side: THREE.DoubleSide,
		visible: false
	}
})
scene.add(planeMesh)
scene.add(...createGridMesh(planeMesh))

const highlightMesh = aliveCellFactory()
scene.add(highlightMesh)

const mousePosition = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let intersectedCell = null

window.addEventListener("mousemove", ({ clientX, clientY }) => {
	mousePosition.x = (clientX / window.innerWidth) * 2 - 1
	mousePosition.y = -(clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(mousePosition, camera)
	intersectedCell = raycaster.intersectObject(planeMesh)[0]

	if(!intersectedCell) {
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

{
	const { matrix } = field
	for(let x = 0; x < matrix.length; x++)
		for(let z = 0; z < matrix[x].length; z++) {
			const v = matrix[x][z]
			const normalize = (d) => d + .5
			let x_ = normalize(x - matrixSize / 2)
			let z_ = normalize(z - matrixSize / 2)
			if(v === 1) {
				const aliveCell = cloneMesh(aliveCellMesh, { x: x_, z: z_ })
				scene.add(aliveCell)
			} else {

			}
		}
}

window.addEventListener("mousedown", function() {
	if(field.isAlive(highlightMesh.position) || !intersectedCell || isIterating) {
		return
	}

	field.revive(highlightMesh.position)
	const aliveCell = cloneMesh(aliveCellMesh, highlightMesh.position);
	scene.add(aliveCell)
});

function animate(time) {
	if(isIterating && iteration < time / 1000 | 0) {
		const matrix = field.matrix
		for(let x = 0; x < matrix.length; x++)
			for(let z = 0; z < matrix[x].length; z++)
				field.iterate({ x, z })
		field.applyChanges()		
	} else {
		highlightMesh.material.opacity = highlightOpacityFunction(time)
	}

	checkRendererAspect(renderer, camera)
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
window.addEventListener("resize", () => checkRendererAspect(renderer, camera))
