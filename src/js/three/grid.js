import * as THREE from "three";

export function createGridMesh(mesh) {
	const wireframe = new THREE.WireframeGeometry(mesh.geometry);
	const wireLine = new THREE.LineSegments(wireframe);
	wireLine.material.depthTest = false;
	wireLine.material.opacity = 0.2;
	wireLine.material.transparent = true;
	wireLine.rotateX(-Math.PI / 2)

	const edges = new THREE.EdgesGeometry(mesh.geometry);
	const edgesLine = new THREE.LineSegments(edges);
	edgesLine.material.depthTest = false;
	edgesLine.material.opacity = 0.5;
	edgesLine.material.transparent = true;
	edgesLine.rotateX(-Math.PI / 2)

	return [wireLine, edgesLine]
}