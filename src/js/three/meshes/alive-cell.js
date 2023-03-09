import * as THREE from "three"
import { horizontalPlaneMesh } from "./plane"

export function aliveCellFactory() {
  return horizontalPlaneMesh({ 
    height: 1, 
    width: 1, 
    material: {
      side: THREE.DoubleSide,
      transparent: true
    }
  })
} 