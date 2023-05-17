import { ReverseNormalizedPosition, RootMesh } from "..";
import { FieldMatrix, HintTemplate } from "../meta";
import { Field } from "./field";

export type TemplateFieldInitializerParams = { template: HintTemplate }
export type TemplateFieldInitializerOutput = {
	templateHintRoot: THREE.Object3D,
	templateMatrix: FieldMatrix,
	templateHintField: Field
}

export type TemplateFieldInitializer = (params: TemplateFieldInitializerParams) => TemplateFieldInitializerOutput

export type HintInitializerParams = {
	template?: HintTemplate,
	globalRoot: RootMesh
}
export type Hint = {
	globalRoot: RootMesh
	root: THREE.Object3D
	animationFunction(time: number): number
	setHintVisibility(value: boolean): void
	setHintPosition(position: ReverseNormalizedPosition): void
	setHintTemplate(params: { template: HintTemplate }): void
	setHintsDefaultState(): void
	isHintVisible(): boolean
	animate(): void
}

export type HintInitializer = (params: HintInitializerParams) => Hint