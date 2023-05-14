import { Vector3 } from "three"

export type PositionToString = (params: { x: number, z: number }) => string

export type IndexConversionFunctionOutput = number
export type IndexConversionFunction = (params: { d: number, max: number }) => IndexConversionFunctionOutput

export type IndexMirroringFunctionOutput = number
export type IndexMirroringFunction = (params: { d: number, max: number }) => IndexMirroringFunctionOutput

export type PositionConversionFunction = (params: { 
	position: { x: number, z: number }
	max: number 
}) => { 
	x: IndexConversionFunctionOutput
	z: IndexConversionFunctionOutput 
}

export type PositionMirroringFunction = (params: { 
	position: { x: number, z: number }
	max: number 
}) => {
	x: IndexMirroringFunctionOutput
	z: IndexMirroringFunctionOutput
}


export type HintNormalizationFunction = (params: {
	position: {
		x: number
		z: number
	}
	rowsCount: number
	colsCount: number
}) => {
	x: number
	z: number
}

export type RaycasterObjectPositionNormalizationFunction = (params: {
	object: THREE.Intersection
	offsetVector: Vector3
}) => {
	x: number
	z: number
	y: number
}