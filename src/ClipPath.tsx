import React from 'react'

export type ClipPathProps = {
  id: string
  d: string
}

const ClipPath: React.FC<ClipPathProps> = ({ id, d }) => {
  return (
    <svg width={0} height={0}>
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d={d}></path>
        </clipPath>
      </defs>
    </svg>
  )
}

function isNotRender(prevProps: ClipPathProps, nextProps: ClipPathProps) {
  if (!nextProps.d) return true
  if (prevProps.d === nextProps.d && prevProps.id === nextProps.id) return true
  return false
}

export default React.memo(ClipPath, isNotRender)
