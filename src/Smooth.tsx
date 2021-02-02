import React, { useEffect, useRef, useState } from 'react'
import ClipPath from './ClipPath'
import { pathCreator } from './pathCreator'
import useSyncedRef from './useSyncedRef'
import { createUseStyles } from 'react-jss'

// All container that are supported.
const containers = ['div', 'p'] as const

// All elements that are supported.
const elements = ['img'] as const

type Containers = typeof containers[number]
type Elements = typeof elements[number]
type Nodes = Containers | Elements

export type SmoothComposition = {
  [key in Nodes]: React.ForwardRefExoticComponent<
    Pick<SmoothProps, React.ReactText> & React.RefAttributes<HTMLElement>
  >
}

// main component
// @ts-ignore
const Smooth: React.FC & SmoothComposition = ({ children }) => (
  <React.Fragment>{children}</React.Fragment>
)

export type SmoothProps = {
  [key: string]: any
  cornerSmoothing: number | string
  borderRadius: number | string
}

/**
 * create all containers.
 */
containers.forEach((container: string) => {
  Smooth[container as Containers] = createComponent(container)
})

/**
 * create all element.
 */
elements.forEach((element: string) => {
  Smooth[element as Elements] = createComponent(element)
})

// add clip path to element
let useStyles = createUseStyles({
  'smooth-cwe': {
    clipPath: (id) => `url(#${id})`,
  },
})

/**
 * component creator.
 * @param {HTMLElement} node
 */
function createComponent(node: string) {
  const Component = React.forwardRef<HTMLElement, SmoothProps>(
    (
      { borderRadius, cornerSmoothing, className, children, name, ...props },
      ref
    ) => {
      const [state, setstate] = useState({
        width: 0,
        height: 0,
      })

      const [path, setpath] = useState('')

      const rootRef = useSyncedRef(ref)
      const id = useRef<string>(`clip-path-${Date.now()}`)

      useEffect(() => {
        const bound = rootRef.current.getBoundingClientRect()

        setstate({
          width: bound.width,
          height: bound.height,
        })

        const ro = new ResizeObserver((entries) => {
          for (let entry of entries) {
            setstate({
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            })
          }
        })

        ro.observe(rootRef.current)

        return () => ro.disconnect()
      }, [])

      useEffect(() => {
        if (state.width && state.height) {
          const newPath = pathCreator(
            state.width,
            state.height,
            borderRadius,
            cornerSmoothing
          )
          if (newPath) setpath(newPath)
          else {
            throw new Error("can't create path")
          }
        }
      }, [state.width, state.height])

      const classes = useStyles(id.current)

      return (
        <>
          {React.createElement(node, {
            ...props,
            className: `${classes['smooth-cwe']} ${className ? className : ''}`,
            ref: rootRef,
          })}
          {/* <Node
              {...props}
              className={`${classes['smooth-cwe']} ${
                className ? className : ''
              }`}
              ref={rootRef}
            >
              {children}
            </Node> */}
          <ClipPath id={id.current} d={path} />
        </>
      )
    }
  )

  return Component
}

export default Smooth
