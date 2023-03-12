import * as THREE from "three"
import { horizontalPlaneMesh } from "./plane"

export function createAliveCellMesh() {
	return horizontalPlaneMesh({
		height: 1,
		width: 1,
		material: {
			side: THREE.DoubleSide,
			transparent: true
		}
	})
}

export const aliveCellMesh = createAliveCellMesh()
