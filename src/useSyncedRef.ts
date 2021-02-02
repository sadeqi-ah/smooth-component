import { useEffect, useRef } from 'react'

function useSyncedRef(ref: any) {
  const innerRef = useRef<any>()

  useEffect(() => {
    if (!ref) return

    if (typeof ref === 'function') {
      ref(innerRef.current)
    } else {
      ref.current = innerRef.current
    }
  })

  return innerRef
}

export default useSyncedRef
