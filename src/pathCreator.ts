type Point = {
  x: number
  y: number
}
const point = (x: number, y: number): Point => ({ x, y })

type Curve = {
  c1: Point
  c2: Point
  p: Point
}
const C = (c1: Point, c2: Point, p: Point): Curve => ({ c1, c2, p })

const pxReg = /^[0-9]*px$/g
const percentReg = /^[0-9]*%$/g
const numReg = /^[0-9]*$/g

type Radius = {
  vRadius: number
  hRadius: number
}

export const pathCreator = (
  width: number,
  height: number,
  radius: number | string,
  smooth: number | string
) => {
  const r = normalizeRadius(radius, height, width)
  const s = normalizeSmooth(smooth)
  if (!r || !s) {
    return undefined
  }

  const { m, ctl, ctr, cbr, cbl, thLine, bhLine, rvLine } = createPath(r, s)

  return `M ${m.x} ${m.y} C ${ctl.c1.x} ${ctl.c1.y} ${ctl.c2.x} ${ctl.c2.y} ${ctl.p.x} ${ctl.p.y} H ${thLine} C ${ctr.c1.x} ${ctr.c1.y} ${ctr.c2.x} ${ctr.c2.y} ${ctr.p.x} ${ctr.p.y} V ${rvLine} C ${cbr.c1.x} ${cbr.c1.y} ${cbr.c2.x} ${cbr.c2.y} ${cbr.p.x} ${cbr.p.y} H ${bhLine} C ${cbl.c1.x} ${cbl.c1.y} ${cbl.c2.x} ${cbl.c2.y} ${cbl.p.x} ${cbl.p.y} Z`
}

export const normalizeRadius = (
  radius: number | string,
  height: number,
  width: number
): Radius | undefined => {
  let result = 0

  if (typeof radius === 'number') {
    result = radius
  } else if (typeof radius === 'string' && radius.match(pxReg)) {
    result = Number(radius.substr(0, radius.length - 2))
  } else if (typeof radius === 'string' && radius.match(numReg)) {
    result = Number(radius)
  } else if (typeof radius === 'string' && radius.match(percentReg)) {
    return {
      vRadius: result,
      hRadius: result,
    }
  } else {
    return undefined
  }

  if (Math.min(height / 2, width / 2) < result) {
    result = Math.min(height / 2, width / 2)
  }

  return {
    vRadius: result / height,
    hRadius: result / width,
  }
}

export const normalizeSmooth = (
  smooth: string | number
): number | undefined => {
  let result = 0
  if (typeof smooth === 'number') {
    result = smooth
  } else if (typeof smooth === 'string' && smooth.match(percentReg)) {
    result = Number(smooth.substr(0, smooth.length - 1))
  } else if (typeof smooth === 'string' && smooth.match(numReg)) {
    result = Number(smooth)
  } else {
    return undefined
  }

  if (result > 100) result = 100

  result /= 100

  return result
}

function createPath(radius: Radius, smooth: number) {
  const { vRadius, hRadius } = radius

  // M point position
  const mPos = point(0, vRadius)

  // C top left
  const ctl = C(
    point(0, vRadius - smooth * vRadius),
    point(hRadius - smooth * hRadius, 0),
    point(hRadius, 0)
  )

  // C top right
  const ctr = C(
    point(1 - (hRadius - smooth * hRadius), 0),
    point(1, vRadius - smooth * vRadius),
    point(1, vRadius)
  )

  // C bottom right
  const cbr = C(
    point(1, 1 - (vRadius - smooth * vRadius)),
    point(1 - (hRadius - smooth * hRadius), 1),
    point(1 - hRadius, 1)
  )

  // C bottom left
  const cbl = C(
    point(hRadius - smooth * hRadius, 1),
    point(0, 1 - (vRadius - smooth * vRadius)),
    point(0, 1 - vRadius)
  )

  // top horizontal line size
  const thLine = 1 - hRadius

  // bottom horizontal line size
  const bhLine = hRadius

  // right vertical line size
  const rvLine = 1 - vRadius

  // left vertical line size
  const lvLine = vRadius

  return {
    m: mPos,
    ctl,
    ctr,
    cbr,
    cbl,
    thLine,
    bhLine,
    lvLine,
    rvLine,
  }
}
