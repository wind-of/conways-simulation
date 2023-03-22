import { DEFAULT_Y_POSITION } from "../constants"
import { createAliveCellMesh } from "../three/meshes/cell"
import { hintOpacityAnimation, hintTerminationOpacityAnimation } from "../three/animation"
import { COLOR_BLUE, COLOR_WHITE } from "../three/colors"

import * as THREE from "three"
import { templateGridPlaneMesh } from "../three/meshes/plane"
import { lifeRulesParser } from "../life-rules"
import { initializeFieldControls } from "./field"

export function initializeHint({ template }) {
	const mesh = createAliveCellMesh()
	mesh.material.visible = false

	const templateHintRoot = new THREE.Object3D()
	const templateGrid = templateGridPlaneMesh({ height: template.height, width: template.width })
	templateHintRoot.add(templateGrid)
	const templateMatrix = lifeRulesParser(template)
	const templateHintField = initializeFieldControls({
		root: templateHintRoot,
		matrix: templateMatrix,
		matrixSize: template.rows,
		shouldInitializeHint: false
	})
	templateHintField.display()

	return {
		root: templateHintRoot,
		animationFunction: hintOpacityAnimation,
		setHintVisibility(value) {
			this.root.visible = value
		},
		setHintPosition({ x, z }) {
			this.root.position.set(x, DEFAULT_Y_POSITION + 0.008, z)
		},
		setHintsDefaultState() {
			this.animationFunction = hintOpacityAnimation
			this.root.color = COLOR_WHITE // TODO: вынести в модуль отрисовки шаблона и сделать цвета конфигурируемыми
			this.setHintVisibility(true)
		},
		setHintsTerminationState() {
			this.animationFunction = hintTerminationOpacityAnimation
			this.root.color = COLOR_BLUE
		},
		isHintVisible() {
			return this.root.visible
		},
		animate({ time }) {
			if (!this.isHintVisible()) {
				return
			}
			this.root.opacity = this.animationFunction(time)
		}
	}
}
