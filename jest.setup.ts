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

// Suppress React 19 act() warnings for tests
// const originalError = console.error
// beforeAll(() => {
//   console.error = (...args: any[]) => {
//     if (
//       typeof args[0] === 'string' &&
//       (args[0].includes('wrapped in act(') ||
//         args[0].includes('suspended resource finished loading'))
//     ) {
//       return
//     }
//     originalError.call(console, ...args)
//   }
// })

// afterAll(() => {
//   console.error = originalError
// })

expect.extend({})
