import L from "leaflet"

/**
 * Calculates the distance between two LatLng points in meters (approximate, using simple Euclidean distance for animation).
 * For more accurate real-world distances, a Haversine formula would be needed.
 */
function getDistance(latlng1: L.LatLngExpression, latlng2: L.LatLngExpression): number {
  const p1 = L.latLng(latlng1)
  const p2 = L.latLng(latlng2)
  return p1.distanceTo(p2) // Leaflet's built-in distanceTo uses spherical law of cosines
}

/**
 * Interpolates a LatLng point along a polyline path based on a given progress (0 to 1).
 * @param path An array of LatLngExpression points defining the polyline.
 * @param progress A value between 0 and 1, representing the percentage along the path.
 * @returns The interpolated LatLng position.
 */
export function interpolatePath(path: L.LatLngExpression[], progress: number): L.LatLngExpression {
  if (path.length < 2) {
    return path[0] || [0, 0] // Return first point or default if path is too short
  }

  if (progress <= 0) {
    return path[0]
  }
  if (progress >= 1) {
    return path[path.length - 1]
  }

  let totalLength = 0
  const segmentLengths: number[] = []

  // Calculate total length and individual segment lengths
  for (let i = 0; i < path.length - 1; i++) {
    const length = getDistance(path[i], path[i + 1])
    segmentLengths.push(length)
    totalLength += length
  }

  if (totalLength === 0) {
    return path[0] // Avoid division by zero if all points are identical
  }

  const targetDistance = totalLength * progress
  let currentDistance = 0

  for (let i = 0; i < segmentLengths.length; i++) {
    const segmentLength = segmentLengths[i]
    const segmentStart = L.latLng(path[i])
    const segmentEnd = L.latLng(path[i + 1])

    if (targetDistance <= currentDistance + segmentLength) {
      // The target point is within this segment
      const segmentProgress = (targetDistance - currentDistance) / segmentLength

      const lat = segmentStart.lat + (segmentEnd.lat - segmentStart.lat) * segmentProgress
      const lng = segmentStart.lng + (segmentEnd.lng - segmentStart.lng) * segmentProgress

      return [lat, lng]
    }
    currentDistance += segmentLength
  }

  // Should not be reached if progress is handled correctly, but as a fallback
  return path[path.length - 1]
}
