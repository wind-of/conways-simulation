import * as THREE from "three";

import { aliveCellFactory, horizontalPlaneMesh, initialization, highlightOpacityFunction, checkRendererAspect, initializeFieldControls } from "./helpers";
import { createGridMesh } from "./grid";

const { renderer, scene, camera } = initialization()
const matrixSize = 20
const field = initializeFieldControls(matrixSize)
let isIterating = true

const planeMesh = horizontalPlaneMesh({ 
	height: matrixSize, 
	width: matrixSize, 
	material: {
		side: THREE.DoubleSide,
		visible: false
	}
})
scene.add(planeMesh);
scene.add(...createGridMesh(planeMesh))

const highlightMesh = aliveCellFactory()
scene.add(highlightMesh);

const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersectedCell = null;

window.addEventListener("mousemove", ({ clientX, clientY }) => {
	mousePosition.x = (clientX / window.innerWidth) * 2 - 1;
	mousePosition.y = -(clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mousePosition, camera);
	intersectedCell = raycaster.intersectObject(planeMesh)[0];

	if(!intersectedCell) {
		highlightMesh.material.visible = false
		return 
	}

	const highlightPos = new THREE.Vector3().copy(intersectedCell.point).floor().addScalar(0.5);
	const isCurrentCellAlive = field.isAlive(highlightPos)
	highlightMesh.material.visible = !isCurrentCellAlive
	intersectedCell = isCurrentCellAlive ? null : intersectedCell
	if(!isCurrentCellAlive) { 
		highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
	}
});

const aliveCellMesh = aliveCellFactory() 

window.addEventListener("mousedown", function() {
	if(field.isAlive(highlightMesh.position) || !intersectedCell || isIterating) {
		return
	}

	const aliveCell = aliveCellMesh.clone();
	aliveCell.position.copy(highlightMesh.position);
	field.revive(highlightMesh.position)
	scene.add(aliveCell);
});

let iteration = 1

function animate(time) {
	highlightMesh.material.opacity = highlightOpacityFunction(time); 
	
	if(isIterating && iteration === time / 1000 | 0) {
		console.log("iteration:", iteration)
		console.log("time:", time / 1000 | 0)
		iteration = time / 1000 | 0
		const matrix = field.matrix
		for(let x = 0; x < matrix.length; x++)
			for(let z = 0; z < matrix[x].length; z++) 
				if(field.shouldRevive({ x, z }))
					field.revive({ x, z }) 
	}

	checkRendererAspect(renderer, camera)
	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
window.addEventListener("resize", () => checkRendererAspect(renderer, camera));
