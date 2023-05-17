import { FieldMatrix } from "."
export type TemplateStringParcerFunctionParams = {
	string: string
	height: number
	width: number
}

export type TemplateStringParcerFunction = (params: TemplateStringParcerFunctionParams) => FieldMatrix

export type EncodeMatrixToTemplateStringFunction = (params: FieldMatrix) => string