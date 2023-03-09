export const positionToKey = ({ x, z }) => `x${x};z${z}`

export const normilizeIndex = (d, max) => max / 2 + Math.round(d) - 1
export const reverseNormilizeIndex = (d, max) =>  d - max / 2 + .5
export const normilizeCoordinates = ({ x, z }, max) => ({
  x: normilizeIndex(x, max),
  z: normilizeIndex(z, max)
})
export const reverseNormilizeCoordinates = ({ x, z }, max) =>  ({
  x: reverseNormilizeIndex(x, max),
  z: reverseNormilizeIndex(z, max)
})