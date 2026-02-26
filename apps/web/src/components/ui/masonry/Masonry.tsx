import type * as React from 'react'
import type { JSX } from 'react'
import { useEffect, useState } from 'react'

interface MasonryProps<T> {
  list: Array<{ id: string; text: string; item: T }>
  columns: number
  Component: React.NamedExoticComponent<{
    text: string
    item: T
    index: number
  }>
}

export function Masonry<T>({ list, columns, Component }: MasonryProps<T>) {
  const [columnWrapperStyle, setColumnWrapperStyle] = useState({})
  const [elements, setElements] = useState<Array<JSX.Element[]>>([])

  useEffect(() => {
    setColumnWrapperStyle({
      columnCount: columns,
      columnGap: '1em',
    })

    const elements = list.reduce(
      (accumulator: Array<JSX.Element[]>, item, i) => {
        const element = (
          <div key={item.id} className="break-inside-avoid">
            <Component text={item.text} item={item.item} index={i} />
          </div>
        )

        const columnIndex = i % columns
        accumulator[columnIndex] = [
          ...(accumulator[columnIndex] || []),
          element,
        ]

        return accumulator
      },
      [],
    )

    setElements(elements)
  }, [list, columns])

  return (
    <div style={columnWrapperStyle} className="relative w-full">
      {elements.map((colElements, i) => (
        <div
          key={i}
          className="relative block w-full align-top"
          // style={{
          //   width: `calc(100% / ${columns})`,
          // }}
        >
          {colElements}
        </div>
      ))}
    </div>
  )
}
