import {
	reverseNormilizePosition,
	positionToString,
	normilizePosition
} from "../../project/coordinates"
import { fullyTerminateMesh, cloneMesh } from "../../project/meshes"

import { doesHintCrossBorders } from "../../utils"
import {
	ALIVE_CELL_VALUE,
	DEAD_CELL_VALUE,
	INVERSION_STATE,
	REVIVAL_STATE,
	TERMINATION_STATE
} from "../../constants/simulation.settings"
import { aliveCellMesh } from "../../project/meshes/cell"
import { initializeFieldMatrixControls } from "./field.matrix"
import { FieldInitializer } from "@/types"
import { setupSimulationSettings } from "../simulation.settings"

export const initializeFieldControls: FieldInitializer = ({
	matrix,
	matrixSize = matrix.length,
	root,
	hint,
	settings = setupSimulationSettings({})
}) => {
	if (hint) {
		root.add(hint.root)
	}
	const fieldControls = initializeFieldMatrixControls({ matrix, matrixSize, settings })
	const { kill, revive, isAlive, willBeAlive, set } = fieldControls
	let changes = []
	return {
		root,
		matrix,
		objects: {},
		controls: fieldControls,

		state: REVIVAL_STATE,
		setState({ state }) {
			this.state = state
		},
		clear() {
			for (let x = 0; x < matrixSize; x++)
				for (let z = 0; z < matrixSize; z++)
					this.terminateCell({
						position: reverseNormilizePosition({ position: { x, z }, max: matrixSize })
					})
			this.hint.setHintVisibility(false)
		},

		hint,
		animate({ time }) {
			if (this.hint) {
				this.hint.animate({ time })
			}
		},
		isAlive,
		saveObject(mesh) {
			this.objects[positionToString(mesh.position)] = mesh
		},
		getObjectAtPosition({ position }) {
			return this.objects[positionToString(position)]
		},
		removeObject(position) {
			this.objects[positionToString(position)] = null
		},
		applyHintTemplateToField({ center }) {
			const { templateMatrix } = this.hint
			const normalizedCenter = normilizePosition({ position: center, max: matrixSize })
			const rowsCount = templateMatrix.length
			const columnsCount = templateMatrix[0].length
			const startX = normalizedCenter.x - Math.floor(rowsCount / 2)
			const startZ = normalizedCenter.z - Math.floor(columnsCount / 2)

			if (doesHintCrossBorders({ matrixSize, rowsCount, columnsCount, startX, startZ })) {
				return
			}

			for (let x = 0; x < rowsCount; x++)
				for (let z = 0; z < columnsCount; z++) {
					const fieldPosition = reverseNormilizePosition({
						position: { x: x + startX, z: z + startZ },
						max: matrixSize
					})
					const stateHandlers = {
						[REVIVAL_STATE]: () => {
							const value = templateMatrix[x][z] ? ALIVE_CELL_VALUE : DEAD_CELL_VALUE
							changes.push({ position: fieldPosition, value })
						},
						[TERMINATION_STATE]: () => {
							if (templateMatrix[x][z]) {
								changes.push({ position: fieldPosition, value: DEAD_CELL_VALUE })
							}
						},
						[INVERSION_STATE]: () => {
							const value = templateMatrix[x][z] ? DEAD_CELL_VALUE : ALIVE_CELL_VALUE
							changes.push({ position: fieldPosition, value })
						}
					}
					stateHandlers[this.state]()
				}
			this.applyChanges()
			this.display()
		},

		applyChanges() {
			changes.forEach(({ value, position: { x, z } }) => {
				set(x, z, value)
				fieldControls.handlePositionChange({ x, z })
			})
			changes = []
		},
		iterate(position_) {
			const position = reverseNormilizePosition({ position: position_, max: matrixSize })
			const value = willBeAlive(position) ? ALIVE_CELL_VALUE : DEAD_CELL_VALUE
			changes.push({ position, value })
		},
		iteratePositions({ positions, isReverseNormalized = false }) {
			for (let i = 0; i < positions.length; i++) {
				const position = isReverseNormalized
					? normilizePosition({ position: positions[i], max: matrixSize })
					: positions[i]
				this.iterate(position)
			}
		},
		reviveCell({ position }) {
			const mesh = this.getObjectAtPosition({ position })
			if (mesh) {
				return
			}
			const aliveCell = cloneMesh(aliveCellMesh, { y: settings.yPosition, ...position })
			this.saveObject(aliveCell)
			revive(position)
			this.root.add(aliveCell)
		},
		terminateCell({ position }) {
			const mesh = this.getObjectAtPosition({ position })
			if (!mesh) {
				return
			}
			fullyTerminateMesh(root, mesh)
			this.removeObject(position)
			kill(position)
		},
		display() {
			for (let x = 0; x < matrixSize; x++)
				for (let z = 0; z < matrixSize; z++) {
					const position = reverseNormilizePosition({ position: { x, z }, max: matrixSize })
					matrix[x][z] === ALIVE_CELL_VALUE
						? this.reviveCell({ position })
						: this.terminateCell({ position })
				}
		}
	}
}
