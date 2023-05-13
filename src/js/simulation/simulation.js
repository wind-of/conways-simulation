import { SECOND_MS, MOUSE_EVENT_LEFT_BUTTON } from "../constants/general"

import * as THREE from "three"

import { initializeFieldControls } from "./field/field"
import { normalizedRaycasterObjectPosition, positionToString } from "../three/coordinates"
import { setupSimulationSettings } from "./settings"
import { initializeRaycaster } from "../three/raycaster"
import { rulesFunctionFactory } from "../life/rules"
import { initializeHint } from "./hint"
import { initializeSimulationRootMesh } from "./simulation.mesh"
import { reverseCoordinateSigns } from "../utils"

export function initializeSimulation({
	camera,
	root = new THREE.Object3D(),
	settings: settings_ = {}
}) {
	const settings = setupSimulationSettings(settings_)
	const { matrix, matrixSize, offset } = settings
	const field = initializeFieldControls({
		root,
		matrix,
		settings,
		hint: initializeHint({ globalRoot: root })
	})
	root.position.set(offset.x, offset.y, offset.z)
	const rootMesh = initializeSimulationRootMesh({ root, matrixSize })
	const raycaster = initializeRaycaster({ object: rootMesh, camera })
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
			const { iterationsPerTime } = this.settings
			for (let k = 0; k < iterationsPerTime; k++) {
				const positions = field.controls.getPositionsToIterate({ shouldClear: true })
				for (let i = 0; i < positions.length; i++) field.iterate(positions[i])
				field.applyChanges()
			}
			field.display()
		},

		updateRulesFunction({ rule }) {
			settings.rulesFunction = rulesFunctionFactory({ name: rule.name })
		},

		toggleIterationState() {
			this.toggleIteration()
			this.field.hint.setHintVisibility(!this.isIterating)
		},

		handleHintTemplateChange({ template }) {
			this.field.hint.setHintTemplate({ template })
		},
		handleStateChange({ state }) {
			this.field.setState({ state })
		},

		handleMouseDown({ button }) {
			if (
				this.isIterating ||
				!this.raycaster.hasIntersectedCell() ||
				button !== MOUSE_EVENT_LEFT_BUTTON
			) {
				return
			}
			const position = normalizedRaycasterObjectPosition({
				object: raycaster.getIntersectedCell(),
				offsetVector: reverseCoordinateSigns(this.settings.offset)
			})
			this.field.applyHintTemplateToField({ center: position })
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
				offsetVector: reverseCoordinateSigns(this.settings.offset)
			})
			const stringifiedPosition = positionToString(position)
			if (stringifiedPosition === previosPosition) {
				return
			}
			previosPosition = stringifiedPosition
			this.field.hint.setHintsDefaultState()
			this.field.hint.setHintPosition(position)

			if (this.isHoldingMouse) {
				this.field.applyHintTemplateToField({ center: position })
			}
		}
	}
}
