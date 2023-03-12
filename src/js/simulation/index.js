import { DEFAULT_ITERATION_PER_SECOND, DEFAULT_MATRIX_SIZE, SECOND_MS } from "../constants"

import { initializeFieldControls } from "./field"

export function initializeSimulation(root) {
	return {
		root,
		isIterating: false,
		iteration: 0,
		matrixSize: DEFAULT_MATRIX_SIZE,
		field: initializeFieldControls(DEFAULT_MATRIX_SIZE),
		toggleIteration() {
			this.isIterating = !this.isIterating
		},
		shouldIterateAtTime({ time }) {
			return this.iteration < time / (SECOND_MS / DEFAULT_ITERATION_PER_SECOND) | 0
		},
		iterate({ time, aliveCellMesh }) {
			if(!this.shouldIterateAtTime({ time })) {
				return
			}
			this.iteration++
			const field = this.field
			for(let x = 0; x < this.matrixSize; x++)
				for(let z = 0; z < this.matrixSize; z++)
					field.iterate({ x, z })
			field.applyChanges()
			field.display(this.root, aliveCellMesh)
		}
	}
}