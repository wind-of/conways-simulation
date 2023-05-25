import { Field, FieldMatrix, HintTemplate, RaycasterModuleOutput, RootMesh, Rule, RulesFunction, SimulationState } from "@/types"

export type SimulationSpecificSettings = {
	setIterationsPerSecond(params: { value: number }): void
	setIterationsPerTime(params: { value: number }): void
}

export type SetupSimulationSettingsParams = {
	rulesFunction: RulesFunction
	iterationsPerSecond: number
	iterationsPerTime: number
	yPosition: number
	matrixSize: number
	offset: THREE.Vector3
	matrix: FieldMatrix
}
export type SetupSimulationSettingsParamsOptional = {
	rulesFunction?: RulesFunction
	iterationsPerSecond?: number
	iterationsPerTime?: number
	yPosition?: number
	matrixSize?: number
	offset?: THREE.Vector3
	matrix?: FieldMatrix
}
export type SimulationSettings = SetupSimulationSettingsParams & SimulationSpecificSettings

export type SetupSimulationSettingsFunction = (options: SetupSimulationSettingsParamsOptional) => SimulationSettings

export type SimulationRootMeshInitializer = (params: {
	root: RootMesh
	matrixSize: number
}) => THREE.Mesh




export type Simulation = {
	root: RootMesh
	field: Field
	settings: SimulationSettings
	raycaster: RaycasterModuleOutput
	isIterating: boolean
	iteration: number
	time: number
	toggleIteration(): void
	shouldIterateAtTime(): boolean
	clearField(): void
	tick(params: { time: number }): void
	iterate(): void
	updateRulesFunction(params: { rule: Rule }): void
	toggleIterationState(): void
	handleHintTemplateChange(params: { template: HintTemplate }): void
	handleStateChange(params: { state: SimulationState }): void
	handleMouseDown(event: MouseEvent): void
	handleMouseUp(): void
	handleMouseMove(event: MouseEvent): void
}

export type SimulationInitializer = (params: {
	camera: THREE.PerspectiveCamera
	root?: RootMesh
	settings: SetupSimulationSettingsParamsOptional
}) => Simulation


