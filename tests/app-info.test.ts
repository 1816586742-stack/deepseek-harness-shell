import { describe, expect, it } from 'vitest'
import { PRODUCT_NAME, PRODUCT_SLUG } from '../src/main/app-info'

describe('app-info', () => {
  it('has a non-empty product name', () => {
    expect(PRODUCT_NAME.length).toBeGreaterThan(0)
  })

  it('slug is kebab-case', () => {
    expect(PRODUCT_SLUG).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })
})
