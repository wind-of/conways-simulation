import * as THREE from "three"
import { NO_INTERSECTED_CELL } from "../../constants"

export function initializeRaycaster({ object, camera }) {
	const mousePosition = new THREE.Vector2()
	const raycaster = new THREE.Raycaster()
	return {
		intersectedCell: NO_INTERSECTED_CELL,
		setMousePosition({ x, y }) {
			mousePosition.x = (x / window.innerWidth) * 2 - 1
			mousePosition.y = -(y / window.innerHeight) * 2 + 1
			raycaster.setFromCamera(mousePosition, camera)
			this.intersectedCell = raycaster.intersectObject(object)[0]
		},
		getIntersectedCell() {
			return this.intersectedCell
		},
		hasIntersectedCell() {
			return !!this.intersectedCell
		}
	}
}
