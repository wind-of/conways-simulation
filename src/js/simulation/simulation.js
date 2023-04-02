import { SECOND_MS, SPACE_KEY, MOUSE_LEFT_BUTTON } from "../constants"

import * as THREE from "three"

import { initializeFieldControls } from "./field/field"
import { normalizedRaycasterObjectPosition, positionToString } from "../three/coordinates"
import { setupSimulationSettings } from "./settings"
import { gameGridPlaneMesh } from "../three/meshes/plane"
import { createGridMesh } from "../three/grid"
import { initializeRaycaster } from "../three/raycaster"
import { rulesFunctionFactory } from "../life/rules"
import { initializeHint } from "./hint"

export function initializeSimulation({
	camera,
	root = new THREE.Object3D(),
	settings: settings_ = {}
}) {
	const settings = setupSimulationSettings(settings_)
	const { matrix } = settings
	const field = initializeFieldControls({
		root,
		matrix,
		settings,
		hint: initializeHint({ globalRoot: root })
	})
	const planeMesh = gameGridPlaneMesh({ size: settings.matrixSize })
	const { wireLine, edgesLine } = createGridMesh(planeMesh)
	const raycaster = initializeRaycaster({ object: planeMesh, camera })
	root.add(planeMesh, wireLine, edgesLine)
	field.display()

	let previosPosition = null
	return {
		root,
		field,
		settings,
		raycaster,

		isHoldingMouse: false,

		isIterating: false,
		iteration: 0,
		time: 0,
		toggleIteration() {
			this.isIterating = !this.isIterating
		},
		shouldIterateAtTime() {
			return this.iteration < ((this.time / (SECOND_MS / settings.iterationsPerSecond)) | 0)
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
			const { matrixSize, iterationsPerTime } = this.settings
			for (let k = 0; k < iterationsPerTime; k++) {
				for (let x = 0; x < matrixSize; x++)
					for (let z = 0; z < matrixSize; z++) field.iterate({ x, z })
				field.applyChanges()
			}
			field.display()
		},

		updateRulesFunction({ rule }) {
			settings.rulesFunction = rulesFunctionFactory({ name: rule.name })
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
			const position = normalizedRaycasterObjectPosition({
				object: raycaster.getIntersectedCell(),
				offsetVector: this.settings.offset
			})
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

			const position = normalizedRaycasterObjectPosition({
				object: intersectedCell,
				offsetVector: this.settings.offset
			})
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
