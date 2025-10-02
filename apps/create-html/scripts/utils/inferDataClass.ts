// Deterministic data-class inference for nodes without explicit data-class
// Goal: same JSX (same tag + stable className set) yields same token

export type InferInput = {
  tag?: string
  dataClass?: string
  className?: string
}

export function inferDataClass(input: InferInput): string | undefined {
  const { tag, dataClass, className } = input
  if (dataClass) return dataClass
  if (!tag) return undefined

  // Only infer for non-empty className
  const classes = (className || '').trim()
  if (!classes) return tag

  // Normalize classes deterministically: split, sort, join
  const normalized = classes
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(' ')

  const hash = shortHash(normalized)
  // Base token is the tag; attach suffix for non-default variant
  return `${tag}-${hash}`
}

// Small deterministic short hash (FNV-1a variant) over UTF-16
function shortHash(str: string): string {
  let h = 0x811c9dc5 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  // base36 for compactness; fixed length by slicing
  return (h.toString(36)).slice(0, 7)
}


