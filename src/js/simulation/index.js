import { DEFAULT_ITERATION_PER_SECOND, DEFAULT_MATRIX_SIZE, SECOND_MS } from "../constants"

import { initializeFieldControls } from "./field"
import { normalizedRaycasterObjectPosition } from "../three/coordinates"
import { zeroMatrix } from "../utils"

export function initializeSimulation({
	root,
	raycaster,
	matrix = zeroMatrix(DEFAULT_MATRIX_SIZE)
}) {
	return {
		root,
		raycaster,
		isIterating: false,
		iteration: 0,
		matrixSize: matrix.length,
		field: initializeFieldControls({ root, matrix }),
		toggleIteration() {
			this.isIterating = !this.isIterating
		},
		shouldIterateAtTime({ time }) {
			return this.iteration < ((time / (SECOND_MS / DEFAULT_ITERATION_PER_SECOND)) | 0)
		},
		iterate({ time }) {
			if (!this.shouldIterateAtTime({ time })) {
				return
			}
			this.iteration++
			const field = this.field
			for (let x = 0; x < this.matrixSize; x++)
				for (let z = 0; z < this.matrixSize; z++) field.iterate({ x, z })
			field.applyChanges()
			field.display()
		},
		handleMouseClick() {
			if (this.isIterating || !this.raycaster.hasIntersectedCell()) {
				return
			}
			const position = normalizedRaycasterObjectPosition({ object: raycaster.getIntersectedCell() })
			this.field.handlePositionChange({ position })
		}
	}
}
