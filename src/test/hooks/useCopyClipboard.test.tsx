import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { act, renderHook, waitFor } from '@/lib/test-util'

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('should copy text to clipboard and trigger success callback', async () => {
    const onSuccess = jest.fn()
    const { result } = renderHook(() =>
      useCopyToClipboard({ onSuccess, resetDelay: 2000 }),
    )

    await act(async () => {
      await result.current.copyToClipboard('Hello, World!')
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello, World!')
    expect(onSuccess).toHaveBeenCalledWith('Hello, World!')
    expect(result.current.isCopied).toBe(true)
  })

  it('should reset isCopied after resetDelay', async () => {
    const onSuccess = jest.fn()
    const { result } = renderHook(() =>
      useCopyToClipboard({ onSuccess, resetDelay: 2000 }),
    )

    await act(async () => {
      await result.current.copyToClipboard('Test')
    })

    expect(result.current.isCopied).toBe(true)

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    await waitFor(() => {
      expect(result.current.isCopied).toBe(false)
    })
  })

  it('should handle empty text gracefully', async () => {
    const onSuccess = jest.fn()
    const { result } = renderHook(() => useCopyToClipboard({ onSuccess }))

    await act(async () => {
      await result.current.copyToClipboard('   ')
    })

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('should call onError when clipboard fails', async () => {
    const onError = jest.fn()
    const error = new Error('Clipboard failed')
    ;(navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(error)

    const { result } = renderHook(() => useCopyToClipboard({ onError }))

    await act(async () => {
      await result.current.copyToClipboard('Text')
    })

    expect(onError).toHaveBeenCalledWith(error)
  })
})
