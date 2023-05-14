import { DEFAULT_Y_POSITION } from "../constants/simulation.settings"
import { hintOpacityAnimation } from "../project/animation"

import { initializeFieldFromTemplate } from "./template"
import { normalizeHintPosition } from "../project/coordinates"
import { DEFAULT_TEMPLATE } from "../life/templates"

export function initializeHint({ template = DEFAULT_TEMPLATE, globalRoot }) {
	const { templateHintRoot, templateMatrix } = initializeFieldFromTemplate({ template })

	return {
		globalRoot,
		root: templateHintRoot,
		templateMatrix,
		animationFunction: hintOpacityAnimation,
		setHintVisibility(value) {
			this.root.visible = value
		},
		setHintPosition(position) {
			const { x, z } = normalizeHintPosition({
				position,
				rowsCount: this.templateMatrix.length,
				colsCount: this.templateMatrix[0].length
			})
			this.root.position.set(x, DEFAULT_Y_POSITION + 0.008, z)
		},
		setHintTemplate({ template }) {
			const { templateHintRoot, templateMatrix } = initializeFieldFromTemplate({ template })
			this.globalRoot.remove(this.root)
			this.globalRoot.add(templateHintRoot)
			this.root = templateHintRoot
			this.templateMatrix = templateMatrix
			templateHintRoot.visible = false
		},
		setHintsDefaultState() {
			this.setHintVisibility(true)
		},
		isHintVisible() {
			return this.root.visible
		},
		animate() {}
	}
}
