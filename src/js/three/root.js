import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { DEFAULT_FOV, DEFAULT_NEAR, DEFAULT_FAR } from "../constants/scene.defaults"

export function projectInitialization({ canvas, cameraPosition = { x: 100, y: 100, z: 0 } }) {
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
	camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
	orbit.update()
	orbit.enableRotate = false

	return {
		renderer,
		scene,
		camera,
		orbit
	}
}
