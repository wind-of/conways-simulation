import {
	DEFAULT_ITERATION_PER_SECOND,
	DEFAULT_MATRIX_SIZE,
	SECOND_MS,
	SPACE_KEY,
	MOUSE_LEFT_BUTTON
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
		isRevivingCells: false,
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
		handleMouseDown({ button }) {
			if (
				this.isIterating ||
				!this.raycaster.hasIntersectedCell() ||
				button !== MOUSE_LEFT_BUTTON
			) {
				return
			}
			const position = normalizedRaycasterObjectPosition({ object: raycaster.getIntersectedCell() })
			const isCellAlive = this.field.isAlive(position)
			this.isHoldingMouse = true
			this.isRevivingCells = !isCellAlive
			this.field.handleCellChange({ position })
		},
		handleMouseUp() {
			this.isHoldingMouse = false
			this.field.setHintVisibility(true)
		},
		handleMouseMove({ clientX, clientY }) {
			this.raycaster.setMousePosition({ x: clientX, y: clientY })
			const intersectedCell = raycaster.getIntersectedCell()
			if (!intersectedCell || this.isIterating) {
				this.field.setHintVisibility(false)
				return
			}

			this.field.setHintsDefaultState()
			const position = normalizedRaycasterObjectPosition({ object: intersectedCell })
			const isTargetAlive = this.field.isAlive(position)

			if (this.isHoldingMouse) {
				this.field.setHintVisibility(false)
				if (this.isRevivingCells && !isTargetAlive) {
					this.field.reviveCell({ position })
				}
				if (!this.isRevivingCells && isTargetAlive) {
					this.field.terminateCell({ position })
				}
			} else {
				this.field.setHintPosition(position)
				if (isTargetAlive) {
					this.field.setHintsTerminationState()
				}
			}
		}
	}
}
