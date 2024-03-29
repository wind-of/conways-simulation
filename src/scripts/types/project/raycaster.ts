import { NO_INTERSECTED_CELL } from "../../constants/simulation.settings"
import { MousePosition } from ".."

export type RaycasterModuleParams = { 
	object: THREE.Mesh
	camera: THREE.PerspectiveCamera
}
export type RaycasterModuleOutput = {
	intersectedCell: typeof NO_INTERSECTED_CELL | THREE.Intersection
	hasIntersectedCell: () => boolean
	getIntersectedCell: () => THREE.Intersection
	setMousePosition: (params: MousePosition) => void
}
export type RaycasterModuleInitializer = (params: RaycasterModuleParams) => RaycasterModuleOutput
