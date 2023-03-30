import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { DEFAULT_FOV, DEFAULT_NEAR, DEFAULT_FAR, DEFAULT_Y_POSITION } from "../constants"

export function projectInitialization({ canvas }) {
	const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
	renderer.setSize(window.innerWidth, window.innerHeight)
	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(
		DEFAULT_FOV,
		window.innerWidth / window.innerHeight,
		DEFAULT_NEAR,
		DEFAULT_FAR
	)
	const orbit = new OrbitControls(camera, renderer.domElement)
	camera.position.set(100, 100, 0)
	orbit.update()
	orbit.enableRotate = false

	return {
		renderer,
		scene,
		camera,
		orbit
	}
}

export function cloneMesh(mesh, { x, z }) {
	const newMesh = mesh.clone()
	newMesh.position.set(x, DEFAULT_Y_POSITION, z)
	return newMesh
}

export function fullyTerminateMesh(scene, mesh) {
	scene.remove(mesh)
	mesh.geometry.dispose()
	mesh.material.dispose()
}
