import { reverseNormilizeCoordinates, normilizeIndex, positionToKey } from "../three/coordinates"
import { fullyTerminateMesh } from "../three/root"
import { cloneMesh } from "../three/root"

import { ALIVE_CELL_VALUE, DEAD_CELL_VALUE } from "../constants"

const randomArray = (length) => Array.from({ length }, () => Math.round(Math.random()))

export function initializeFieldControls(matrixSize) {
  const matrix = Array.from({ length: matrixSize }, () => randomArray(matrixSize));
  
  const objects = {}
  const index = (d) => normilizeIndex(d, matrixSize)
  const set = (x, z, v) => matrix[index(x)][index(z)] = v
  const get = (x, z) => matrix[index(x)] && matrix[index(x)][index(z)] || 0
  
  const revive = ({ x, z }) => set(x, z, ALIVE_CELL_VALUE)
  const kill = ({ x, z }) => set(x, z, DEAD_CELL_VALUE)
  const isAlive = ({ x, z }) => !!get(x, z)

  const shouldBeAlive = ({ x, z }) => {
    const isCellAlive = isAlive({ x, z })
    const count = (
      get(x - 1, z - 1) +
      get(x - 1, z) + 
      get(x - 1, z + 1) +
      get(x, z - 1) + 
      get(x, z + 1) +
      get(x + 1, z - 1) +
      get(x + 1, z) + 
      get(x + 1, z + 1)
    )
    return isCellAlive 
      ? count > 1 && count < 4 
      : count === 3
  }
  let changes = []

  return {
    matrix,
    objects,

    revive,
    kill,
    isAlive,
    
    saveObject(mesh) {
      const key = positionToKey(mesh.position)
      objects[key] = mesh
    },
    getObject(position) {
      return objects[positionToKey(position)]
    },
    removeObject(position) {
      objects[positionToKey(position)] = null
    },
    applyChanges() {
      changes.forEach(({ value, position: { x, z } }) => set(x, z, value))
      changes = []
    },
    iterate(coordinates) {
      const position = reverseNormilizeCoordinates(coordinates, matrixSize)
      const isCellAlive = isAlive(position)
      if(shouldBeAlive(position)) {
        return !isCellAlive && changes.push({ position, value: ALIVE_CELL_VALUE })
      } else {
        return isCellAlive && changes.push({ position, value: DEAD_CELL_VALUE })
      }
    },
    display(scene, aliveCellMesh) {
      for(let x = 0; x < matrixSize; x++)
        for(let z = 0; z < matrixSize; z++) {
          const v = matrix[x][z]
          const position = reverseNormilizeCoordinates({ x, z }, matrixSize)
          const mesh = this.getObject(position)
          if(v === 1) {
            if(mesh) {
              continue
            }
            const aliveCell = cloneMesh(aliveCellMesh, position)
            this.saveObject(aliveCell)
            scene.add(aliveCell) 
          } else if(mesh) {
            fullyTerminateMesh(scene, mesh)
            this.removeObject(position)
          }
        }
    }
  }
}
