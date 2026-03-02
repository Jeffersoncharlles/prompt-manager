import '@testing-library/jest-dom'

import { webcrypto } from 'crypto'
import { TextDecoder, TextEncoder } from 'util'

;(global as any).TextEncoder = TextEncoder
;(global as any).TextDecoder = TextDecoder
if (!(global as any).crypto) {
  ;(global as any).crypto = webcrypto
}

expect.extend({})
