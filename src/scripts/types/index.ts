export * from "./project"

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

export type EmptyFunction = (params: unknown) => unknown 
