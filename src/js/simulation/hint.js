import { DEFAULT_Y_POSITION } from "../constants"
import { createAliveCellMesh } from "../three/meshes/cell"
import { hintOpacityAnimation, hintTerminationOpacityAnimation } from "../three/animation"
import { COLOR_BLUE, COLOR_WHITE } from "../three/colors"

export function initializeHint() {
	const mesh = createAliveCellMesh()
	mesh.material.visible = false

	return {
		mesh,
		animationFunction: hintOpacityAnimation,
		setHintVisibility(value) {
			this.mesh.material.visible = value
		},
		setHintPosition({ x, z }) {
			this.mesh.position.set(x, DEFAULT_Y_POSITION + 0.008, z)
		},
		setHintsDefaultState() {
			this.animationFunction = hintOpacityAnimation
			this.mesh.material.color = COLOR_WHITE
			this.setHintVisibility(true)
		},
		setHintsTerminationState() {
			this.animationFunction = hintTerminationOpacityAnimation
			this.mesh.material.color = COLOR_BLUE
		},
		isHintVisible() {
			return this.mesh.visible
		},
		animate({ time }) {
			if (!this.isHintVisible()) {
				return
			}
			this.mesh.material.opacity = this.animationFunction(time)
		}
	}
}
