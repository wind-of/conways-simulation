import {
	DEFAULT_ITERATION_PER_SECOND,
	DEFAULT_MATRIX_SIZE,
	SECOND_MS,
	SPACE_KEY,
	MOUSE_LEFT_BUTTON,
	DEFAULT_ITERATION_PER_TIME
} from "../constants"

import * as THREE from "three"

import { initializeFieldControls } from "./field"
import { normalizedRaycasterObjectPosition, positionToString } from "../three/coordinates"
import { zeroMatrix, setupSimulationSettings } from "../utils"
import { gameGridPlaneMesh } from "../three/meshes/plane"
import { createGridMesh } from "../three/grid"
import { initializeRaycaster } from "../three/raycaster"
import { rulesFunctionFactory } from "../life/rules"

export function initializeSimulation({
	camera,
	root = new THREE.Object3D(),
	matrix = zeroMatrix(DEFAULT_MATRIX_SIZE),
	settings
}) {
	const settings_ = setupSimulationSettings(settings)
	const matrixSize = matrix.length

	const field = initializeFieldControls({ root, matrix, settings: settings_ })
	const planeMesh = gameGridPlaneMesh({ size: matrixSize })
	const { wireLine, edgesLine } = createGridMesh(planeMesh)
	const raycaster = initializeRaycaster({ object: planeMesh, camera })
	root.add(planeMesh, wireLine, edgesLine)
	field.display()

	let previosPosition = null
	return {
		root,
		field,
		matrixSize,
		raycaster,

		isHoldingMouse: false,

		isIterating: false,
		iteration: 0,
		time: 0,
		toggleIteration() {
			this.isIterating = !this.isIterating
		},
		shouldIterateAtTime() {
			return this.iteration < ((this.time / (SECOND_MS / DEFAULT_ITERATION_PER_SECOND)) | 0)
		},

		clearField() {
			this.field.clear()
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
			for (let k = 0; k < DEFAULT_ITERATION_PER_TIME; k++) {
				for (let x = 0; x < this.matrixSize; x++)
					for (let z = 0; z < this.matrixSize; z++) field.iterate({ x, z })
				field.applyChanges()
			}
			field.display()
		},

		updateRulesFunction({ rule }) {
			settings_.rulesFunction = rulesFunctionFactory({ name: rule.name })
		},

		handleHintTemplateChange({ template }) {
			this.field.hint.setHintTemplate({ template })
		},
		handleStateChange({ state }) {
			this.field.setState({ state })
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
			this.field.handleCellChange({ position })
			this.isHoldingMouse = true
		},
		handleMouseUp() {
			this.isHoldingMouse = false
			this.field.hint.setHintVisibility(!this.isIterating && this.raycaster.hasIntersectedCell())
		},
		handleMouseMove({ clientX, clientY }) {
			this.raycaster.setMousePosition({ x: clientX, y: clientY })
			const intersectedCell = raycaster.getIntersectedCell()
			if (!intersectedCell || this.isIterating) {
				this.field.hint.setHintVisibility(false)
				return
			}

			const position = normalizedRaycasterObjectPosition({ object: intersectedCell })
			const stringifiedPosition = positionToString(position)
			if (stringifiedPosition === previosPosition) {
				return
			}
			previosPosition = stringifiedPosition
			this.field.hint.setHintsDefaultState()
			this.field.hint.setHintPosition(position)

			if (this.isHoldingMouse) {
				this.field.handleCellChange({ position })
			}
		}
	}
}
