import '@testing-library/jest-dom'

import { webcrypto } from 'node:crypto'
import { TextDecoder, TextEncoder } from 'node:util'

Object.defineProperty(globalThis, 'TextEncoder', {
  value: TextEncoder,
  configurable: true,
  writable: true,
})

Object.defineProperty(globalThis, 'TextDecoder', {
  value: TextDecoder,
  configurable: true,
  writable: true,
})

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
    writable: true,
  })
}

expect.extend({})
