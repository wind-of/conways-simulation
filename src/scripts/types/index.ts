import { ALIVE_CELL_VALUE, DEAD_CELL_VALUE, INVERSION_STATE, REVIVAL_STATE, TERMINATION_STATE } from "@/constants/simulation.settings"

export * from "./project"
export * from "./simulation"
export * from "./meta"

export type CameraPosition = {
	x: number,
	y: number,
	z: number
}
export type MousePosition = {
	x: number
	y: number
}
export type Color = THREE.Color | number | string
export type Position = { 
	x: number
	y: number
	z: number
} | THREE.Vector3

export type NormalizedPosition = {
	x: number
	y?: number
	z: number
}
export type ReverseNormalizedPosition = {
	x: number
	y?: number
	z: number
}

export type ReverseNormalizedIndex = number
export type NormalizedIndex = number

export type CellValue = typeof ALIVE_CELL_VALUE | typeof DEAD_CELL_VALUE
export type SimulationState = typeof REVIVAL_STATE | typeof INVERSION_STATE | typeof TERMINATION_STATE
export type RootMesh = THREE.Mesh | THREE.Object3D

export type EmptyFunction = (params: unknown) => unknown 
