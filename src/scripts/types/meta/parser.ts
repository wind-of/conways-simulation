import { FieldMatrix } from "."
export type TemplateStringParserFunctionParams = {
	string: string
	height: number
	width: number
}

export type TemplateStringParserFunction = (params: TemplateStringParserFunctionParams) => FieldMatrix

export type EncodeMatrixToTemplateStringFunction = (params: FieldMatrix) => string