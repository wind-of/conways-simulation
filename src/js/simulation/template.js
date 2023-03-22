import * as THREE from "three"
import { templateGridPlaneMesh } from "../three/meshes/plane"
import { lifeRulesParser } from "../life"
import { initializeFieldControls } from "./field"

export function initializeFieldFromTemplate({ template }) {
	const templateHintRoot = new THREE.Object3D()
	const templateGrid = templateGridPlaneMesh({ height: template.height, width: template.width })
	const templateMatrix = lifeRulesParser(template)
	const templateHintField = initializeFieldControls({
		root: templateHintRoot,
		matrix: templateMatrix,
		matrixSize: template.rows,
		shouldInitializeHint: false
	})
	templateHintRoot.add(templateGrid)
	templateHintField.display()

	return {
		templateHintRoot,
		templateMatrix,
		templateHintField
	}
}
