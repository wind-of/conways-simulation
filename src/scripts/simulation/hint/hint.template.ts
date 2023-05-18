import * as THREE from "three"
import { templateGridPlaneMesh } from "../../project/meshes/plane"
import { templateStringParcerParser } from "../../meta/parser"
import { initializeFieldControls } from "../field"
import { TemplateFieldInitializer } from "@/types/simulation"

export const initializeFieldFromTemplate: TemplateFieldInitializer = ({ template }) => {
	const templateHintRoot = new THREE.Object3D()
	const templateGrid = templateGridPlaneMesh({ height: template.height, width: template.width })
	const templateMatrix = templateStringParcerParser(template)
	const templateHintField = initializeFieldControls({
		root: templateHintRoot,
		matrix: templateMatrix,
		matrixSize: template.width
	})
	templateHintRoot.add(templateGrid)
	templateHintField.display()

	return {
		templateHintRoot,
		templateMatrix,
		templateHintField
	}
}
