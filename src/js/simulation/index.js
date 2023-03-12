import { DEFAULT_ITERATION_PER_SECOND, DEFAULT_MATRIX_SIZE, SECOND_MS } from "../constants"

import { initializeFieldControls } from "./field"

export function initializeSimulation() {
	return {
		isIterating: false,
		iteration: 0,
		matrixSize: DEFAULT_MATRIX_SIZE,
		field: initializeFieldControls(DEFAULT_MATRIX_SIZE),
		shouldIterateAtTime({ time }) {
			return this.iteration < time / (SECOND_MS / DEFAULT_ITERATION_PER_SECOND) | 0
		}
	}
}