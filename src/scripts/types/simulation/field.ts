import { CellValue, FieldMatrix, Hint, NormalizedPosition, Position, ReverseNormalizedIndex, ReverseNormalizedPosition, RootMesh, SimulationSettings, SimulationState } from "@/types"

export type FieldSettings = SimulationSettings
export type Field = {
	root: THREE.Mesh
	matrix: FieldMatrix
	objects: object
	controls: FieldMatrixControls
	state: SimulationState
	setState(params: { state: SimulationState }): void
	clear(): void
	hint: Hint,
	animate(params: { time: number }): void
	isAlive(params: ReverseNormalizedPosition): boolean
	saveObject(mesh: THREE.Mesh): void
	getObjectAtPosition(params: { position: ReverseNormalizedPosition }): void
	removeObject(position: ReverseNormalizedPosition): void
	applyHintTemplateToField(params: { center: ReverseNormalizedPosition }): void
	applyChanges(): void
	iterate(position: NormalizedPosition): void
	iteratePositions(params: {
		positions: Array<ReverseNormalizedPosition | NormalizedPosition>
		isReverseNormalized: boolean
	}): void
	reviveCell(params: { position: ReverseNormalizedPosition }): void
	terminateCell(params: { position: ReverseNormalizedPosition }): void
	display(): void
}
export type FieldInitializerParams = {
	matrix: FieldMatrix
	matrixSize?: number
	root: RootMesh
	hint: Hint
	settings: FieldSettings
}
export type FieldInitializer = (params: FieldInitializerParams) => Field

export type FieldMatrixControlsInitializerParams = {
	matrix: FieldMatrix
	matrixSize: number
	settings: FieldSettings
}

export type FieldMatrixControls = {
	revive({ x, y }: ReverseNormalizedPosition): void
	kill({ x, y }: ReverseNormalizedPosition): void
	isAlive({ x, y }: ReverseNormalizedPosition): boolean
	willBeAlive({ x, y }: ReverseNormalizedPosition): boolean
	set(x: ReverseNormalizedIndex, z: ReverseNormalizedIndex, v: CellValue): CellValue
	get(x: ReverseNormalizedIndex, z: ReverseNormalizedIndex): CellValue
	potentiallyActiveCells: Array<NormalizedPosition>,
	positionsSet: Set<string>,
	getPositionsToIterate(params: { shouldClear: boolean }): Array<Position>,
	clearPotentiallyActivePositions(): void,
	handlePositionChange(position: ReverseNormalizedPosition): void
}

export type FieldMatrixControlsInitializer = (params: FieldMatrixControlsInitializerParams) => FieldMatrixControls