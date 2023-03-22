import {
	DEFAULT_ITERATION_PER_SECOND,
	DEFAULT_MATRIX_SIZE,
	SECOND_MS,
	SPACE_KEY,
	MOUSE_LEFT_BUTTON
} from "../constants"

import * as THREE from "three"

import { initializeFieldControls } from "./field"
import { normalizedRaycasterObjectPosition } from "../three/coordinates"
import { zeroMatrix } from "../utils"
import { gameGridPlaneMesh } from "../three/meshes/plane"
import { createGridMesh } from "../three/grid"
import { initializeRaycaster } from "../three/raycaster"

// TODO: если нет изменений, не пытаться перерисовывать
// TODO: поиск начинать с ближайшей клетки, у которой есть соседи
// TODO: несколько "итераций" за раз

export function initializeSimulation({
	camera,
	root = new THREE.Object3D(),
	matrix = zeroMatrix(DEFAULT_MATRIX_SIZE)
}) {
	const matrixSize = matrix.length

	const field = initializeFieldControls({ root, matrix })
	const planeMesh = gameGridPlaneMesh({ size: matrixSize })
	const { wireLine, edgesLine } = createGridMesh(planeMesh)
	const raycaster = initializeRaycaster({ object: planeMesh, camera })
	root.add(planeMesh, wireLine, edgesLine)
	field.display()
	return {
		root,
		field,
		matrixSize,
		raycaster,

		isHoldingMouse: false,
		isRevivingCells: false,

		isIterating: false,
		iteration: 0,
		time: 0,
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
				this.field.animate({ time })
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

		handleHintTemplateChange({ template }) {
			this.field.hint.setHintTemplate({ template })
		},
		handleStateChange({ state }) {
			state
		},

		handleKeydown({ key }) {
			if (key === SPACE_KEY) {
				this.toggleIteration()
				this.field.hint.setHintVisibility(!this.isIterating)
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
			this.field.hint.setHintVisibility(true)
		},
		handleMouseMove({ clientX, clientY }) {
			this.raycaster.setMousePosition({ x: clientX, y: clientY })
			const intersectedCell = raycaster.getIntersectedCell()
			if (!intersectedCell || this.isIterating) {
				this.field.hint.setHintVisibility(false)
				return
			}

			this.field.hint.setHintsDefaultState()
			const position = normalizedRaycasterObjectPosition({ object: intersectedCell })
			const isTargetAlive = this.field.isAlive(position)

			if (this.isHoldingMouse) {
				this.field.hint.setHintVisibility(false)
				if (this.isRevivingCells && !isTargetAlive) {
					this.field.handleCellChange({ position })
				}
			} else {
				this.field.hint.setHintPosition(position)
			}
		}
	}
}
