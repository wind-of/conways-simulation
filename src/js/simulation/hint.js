import { DEFAULT_Y_POSITION } from "../constants"
import { hintOpacityAnimation } from "../three/animation"

import { initializeFieldFromTemplate } from "./template"

export function initializeHint({ template, globalRoot }) {
	const { templateHintRoot, templateMatrix } = initializeFieldFromTemplate({ template })

	return {
		globalRoot,
		root: templateHintRoot,
		templateMatrix,
		animationFunction: hintOpacityAnimation,
		setHintVisibility(value) {
			this.root.visible = value
		},
		setHintPosition({ x, z }) {
			this.root.position.set(x, DEFAULT_Y_POSITION + 0.01, z)
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
