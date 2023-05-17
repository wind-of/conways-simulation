import { SECOND_MS, MOUSE_EVENT_LEFT_BUTTON } from "../constants/general"

import * as THREE from "three"

import { initializeFieldControls } from "./field"
import { raycasterIntersectionPosition, positionToString } from "../project/coordinates"
import { setupSimulationSettings } from "./simulation.settings"
import { initializeRaycaster } from "../project/raycaster"
import { rulesFunctionFactory } from "../meta/rules"
import { initializeHint } from "./hint"
import { initializeSimulationRootMesh } from "./simulation.mesh"
import { reverseCoordinateSigns } from "../utils"
import { SimulationInitializer } from "@/types"

export const initializeSimulation: SimulationInitializer = ({
	camera,
	root = new THREE.Object3D(),
	settings: settings_ = {}
}) => {
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

	let isHoldingMouse = false
	let previosPosition = null
	return {
		root,
		field,
		settings,
		raycaster,

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
			const position = raycasterIntersectionPosition({
				object: raycaster.getIntersectedCell(),
				offsetVector: reverseCoordinateSigns(this.settings.offset)
			})
			this.field.applyHintTemplateToField({ center: position })
			isHoldingMouse = true
		},
		handleMouseUp() {
			isHoldingMouse = false
			this.field.hint.setHintVisibility(!this.isIterating && this.raycaster.hasIntersectedCell())
		},
		handleMouseMove({ clientX, clientY }) {
			this.raycaster.setMousePosition({ x: clientX, y: clientY })
			const intersectedCell = raycaster.getIntersectedCell()
			if (!intersectedCell || this.isIterating) {
				this.field.hint.setHintVisibility(false)
				return
			}

			const position = raycasterIntersectionPosition({
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

			if (isHoldingMouse) {
				this.field.applyHintTemplateToField({ center: position })
			}
		}
	}
}
