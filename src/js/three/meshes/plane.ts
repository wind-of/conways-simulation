import * as THREE from "three"
import { PlaneMeshFunction, PlaneMeshFunctionParameters, PlaneMeshFunctionOutput, GameGridPlaneMesh, TemplateGridPlaneMesh } from "../../types"

export const planeMesh: PlaneMeshFunction = ({ height, width, material }) => {
	const mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(width, height, width, height),
		new THREE.MeshBasicMaterial(material)
	)
	return mesh
}

export function horizontalPlaneMesh(options: PlaneMeshFunctionParameters): PlaneMeshFunctionOutput {
	const mesh = planeMesh(options)
	mesh.rotateX(-Math.PI / 2)
	return mesh
}

export const gameGridPlaneMesh = ({ size, height, width }: GameGridPlaneMesh): PlaneMeshFunctionOutput => {
	return horizontalPlaneMesh({
		height: height || size,
		width: width || size,
		material: {
			side: THREE.DoubleSide,
			visible: false
		}
	})
}

export const templateGridPlaneMesh: TemplateGridPlaneMesh = ({ height, width, color = 0x222222 }) => {
	return horizontalPlaneMesh({
		height,
		width,
		material: {
			side: THREE.DoubleSide,
			color
		}
	})
}
