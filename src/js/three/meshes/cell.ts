import * as THREE from "three"
import { horizontalPlaneMesh } from "./plane"
import { PlaneMeshFunctionOutput } from "../../types"

export function createAliveCellMesh(): PlaneMeshFunctionOutput {
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
