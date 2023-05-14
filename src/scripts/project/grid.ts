import * as THREE from "three"
import { GridMesh } from "../types"

const linesMaterial = ({ opacity }) => new THREE.LineBasicMaterial({ depthTest: false, opacity, transparent: true })

export function createGridMesh(mesh: THREE.Mesh): GridMesh {
	const wireLine = new THREE.LineSegments(
		new THREE.WireframeGeometry(mesh.geometry), 
		linesMaterial({ opacity: .1 })
	)
	wireLine.rotateX(-Math.PI / 2)

	const edgesLine = new THREE.LineSegments(
		new THREE.EdgesGeometry(mesh.geometry), 
		linesMaterial({ opacity: .5 })
	)
	edgesLine.rotateX(-Math.PI / 2)

	return { wireLine, edgesLine }
}
