import { ALIVE_CELL_VALUE, DEAD_CELL_VALUE } from "@/constants/simulation.settings"

export type TemplateStringParcerFunctionParams = {
	string: string
	height: number
	width: number
}
export type TemplateStringParcerFunctionOutput = Array<Array<typeof ALIVE_CELL_VALUE | typeof DEAD_CELL_VALUE>>

export type TemplateStringParcerFunction = (params: TemplateStringParcerFunctionParams) => TemplateStringParcerFunctionOutput 

export type EncodeMatrixToTemplateStringFunction = (params: TemplateStringParcerFunctionOutput) => string