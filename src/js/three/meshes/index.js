import { DEFAULT_Y_POSITION } from "../../constants"

export function cloneMesh(mesh, { x, y = DEFAULT_Y_POSITION, z }) {
	const newMesh = mesh.clone()
	newMesh.position.set(x, y, z)
	return newMesh
}

export function fullyTerminateMesh(scene, mesh) {
	scene.remove(mesh)
	mesh.geometry.dispose()
	mesh.material.dispose()
}
