export * from "./mesh"
export * from "./coordinates"
export * from "./raycaster"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraPosition } from "@/types";

export type ProjectModuleParameters = {
	canvas: HTMLCanvasElement
	cameraPosition?: CameraPosition
}

export type ProjectModule = (parameters: ProjectModuleParameters) => {
	renderer: THREE.WebGLRenderer
	scene: THREE.Scene
	camera: THREE.PerspectiveCamera
	orbit: OrbitControls
}


