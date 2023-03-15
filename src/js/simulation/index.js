import {
	DEFAULT_ITERATION_PER_SECOND,
	DEFAULT_MATRIX_SIZE,
	SECOND_MS,
	SPACE_KEY
} from "../constants"

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
		isHoldingMouse: false,
		isIterating: false,
		iteration: 0,
		time: 0,
		matrixSize: matrix.length,
		field: initializeFieldControls({ root, matrix }),
		toggleIteration() {
			this.isIterating = !this.isIterating
		},
		shouldIterateAtTime() {
			return this.iteration < ((this.time / (SECOND_MS / DEFAULT_ITERATION_PER_SECOND)) | 0)
		},
		tick({ time }) {
			this.time = time
			if (this.isIterating) {
				this.iterate()
			} else {
				this.field.animateHint({ time })
			}
		},
		iterate() {
			if (!this.shouldIterateAtTime()) {
				return
			}
			this.iteration++
			const field = this.field
			for (let x = 0; x < this.matrixSize; x++)
				for (let z = 0; z < this.matrixSize; z++) field.iterate({ x, z })
			field.applyChanges()
			field.display()
		},
		handleKeydown({ key }) {
			if (key === SPACE_KEY) {
				this.toggleIteration()
				this.field.setHintVisibility(!this.isIterating)
			}
		},
		handleMouseDown() {
			if (this.isIterating || !this.raycaster.hasIntersectedCell()) {
				return
			}
			this.isHoldingMouse = true
			const position = normalizedRaycasterObjectPosition({ object: raycaster.getIntersectedCell() })
			this.field.handleCellChange({ position })
		},
		handleMouseUp() {
			this.isHoldingMouse = false
		},
		handleMouseMove({ clientX, clientY }) {
			this.raycaster.setMousePosition({ x: clientX, y: clientY })
			const intersectedCell = raycaster.getIntersectedCell()
			if (!intersectedCell || this.isIterating) {
				this.field.setHintVisibility(false)
				return
			}

			this.field.setHintsDefaultState()
			const targetPosition = normalizedRaycasterObjectPosition({ object: intersectedCell })
			const isTargetAlive = this.field.isAlive(targetPosition)

			if (this.isHoldingMouse) {
				if (!isTargetAlive) {
					this.field.reviveCell({ position: targetPosition })
				}
			} else {
				this.field.setHintPosition(targetPosition)
				if (isTargetAlive) {
					this.field.setHintsTerminationState()
				}
			}
		}
	}
}
