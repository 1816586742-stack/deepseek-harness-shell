import { describe, expect, it } from 'vitest'
import { parseReadyLine } from '../src/main/dsh-process'

describe('parseReadyLine', () => {
  it('parses a standard readiness line', () => {
    const output = 'dsh web: http://127.0.0.1:48392\n'
    expect(parseReadyLine(output)).toBe('http://127.0.0.1:48392')
  })

  it('parses readiness line preceded by log noise', () => {
    const output = [
      '[info] loading plugins...',
      '[info] loader settled',
      'dsh web: http://127.0.0.1:5173',
      '[info] serving frontend',
    ].join('\n')
    expect(parseReadyLine(output)).toBe('http://127.0.0.1:5173')
  })

  it('returns null when no readiness line is present', () => {
    const output = '[info] loading...\n[info] starting server...\n'
    expect(parseReadyLine(output)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(parseReadyLine('')).toBeNull()
  })
})
