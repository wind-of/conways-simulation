import { Material } from "three"
import { DEFAULT_Y_POSITION } from "../../constants/simulation.settings"
import { Position } from "@/types"

export function cloneMesh(mesh: THREE.Mesh, { x, y = DEFAULT_Y_POSITION, z }: Position): THREE.Mesh {
	const newMesh = mesh.clone()
	newMesh.position.set(x, y, z)
	return newMesh
}

export function fullyTerminateMesh(scene: THREE.Scene | THREE.Mesh | THREE.Object3D, mesh: THREE.Mesh): void {
	scene.remove(mesh)
	mesh.geometry.dispose()
	;(mesh.material as Material).dispose()
}
