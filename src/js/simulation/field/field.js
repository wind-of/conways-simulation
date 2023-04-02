import {
	reverseNormilizeCoordinates,
	positionToString,
	normilizeCoordinates
} from "../../three/coordinates"
import { fullyTerminateMesh, cloneMesh } from "../../three/meshes"

import {
	ALIVE_CELL_VALUE,
	DEAD_CELL_VALUE,
	INVERSION_STATE,
	REVIVAL_STATE,
	TERMINATION_STATE
} from "../../constants"
import { aliveCellMesh } from "../../three/meshes/cell"
import { initializeFieldMatrixControls } from "./field.matrix"

export function initializeFieldControls({
	matrix,
	matrixSize = matrix.length,
	root,
	hint,
	settings = {}
}) {
	if (hint) {
		root.add(hint.root)
	}
	const { kill, revive, isAlive, willBeAlive, set } = initializeFieldMatrixControls({
		matrix,
		matrixSize,
		settings
	})
	let changes = []
	return {
		root,
		matrix,
		objects: {},
		state: REVIVAL_STATE,
		setState({ state }) {
			this.state = state
		},
		clear() {
			for (let x = 0; x < matrixSize; x++)
				for (let z = 0; z < matrixSize; z++)
					this.terminateCell({
						position: reverseNormilizeCoordinates({ position: { x, z }, max: matrixSize })
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
			const normalizedCenter = normilizeCoordinates({ position: center, max: matrixSize })
			const rowsCount = templateMatrix.length
			const columnsCount = templateMatrix[0].length
			const startX = normalizedCenter.x - Math.floor(columnsCount / 2)
			const startZ = normalizedCenter.z - Math.floor(rowsCount / 2)

			for (let x = 0; x < columnsCount; x++)
				for (let z = 0; z < rowsCount; z++) {
					const fieldPosition = reverseNormilizeCoordinates({
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
		handleCellChange({ position }) {
			this.applyHintTemplateToField({ center: position })
		},

		applyChanges() {
			changes.forEach(({ value, position: { x, z } }) => set(x, z, value))
			changes = []
		},
		iterate(position_) {
			const position = reverseNormilizeCoordinates({ position: position_, max: matrixSize })
			const value = willBeAlive(position) ? ALIVE_CELL_VALUE : DEAD_CELL_VALUE
			changes.push({ position, value })
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
					const position = reverseNormilizeCoordinates({ position: { x, z }, max: matrixSize })
					matrix[x][z] === ALIVE_CELL_VALUE
						? this.reviveCell({ position })
						: this.terminateCell({ position })
				}
		}
	}
}