import { Color } from "@/types";

export type GridMesh = {
	wireLine: THREE.LineSegments,
	edgesLine: THREE.LineSegments
}
export type GameGridPlaneMesh = {
	size: number
	width: number
	height: number
}

export type TemplateGridPlaneMeshParameters = {
	height: number
	width: number
	color: Color
}
export type TemplateGridPlaneMesh = (params: TemplateGridPlaneMeshParameters) => PlaneMeshFunctionOutput

export type PlaneMeshFunctionParameters = { 
	height: number
	width: number
	material: THREE.MeshBasicMaterialParameters 
} 
export type PlaneMeshFunctionOutput = THREE.Mesh
export type PlaneMeshFunction = (params: PlaneMeshFunctionParameters) => PlaneMeshFunctionOutput
