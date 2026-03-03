import '@testing-library/jest-dom'

import { webcrypto } from 'crypto'
import { TextDecoder, TextEncoder } from 'util'

;(global as any).TextEncoder = TextEncoder
;(global as any).TextDecoder = TextDecoder
if (!(global as any).crypto) {
  ;(global as any).crypto = webcrypto
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
