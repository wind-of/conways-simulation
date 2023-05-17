import { gameGridPlaneMesh } from "../project/meshes/plane"
import { createGridMesh } from "../project/grid"
import { SimulationRootMeshInitializer } from "@/types"

export const initializeSimulationRootMesh: SimulationRootMeshInitializer = ({ root, matrixSize: size }) => {
	const rootMesh = gameGridPlaneMesh({ size })
	const { wireLine, edgesLine } = createGridMesh(rootMesh)
	root.add(rootMesh, wireLine, edgesLine)
	return rootMesh
}
