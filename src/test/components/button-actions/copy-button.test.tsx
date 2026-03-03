import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import { CopyButton } from '@/components/button-actions/copy-button'
import { render, screen, waitFor } from '@/lib/test-util'

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('@/hooks/useCopyToClipboard', () => ({
  useCopyToClipboard: jest.fn().mockImplementation(
    (
      options:
        | {
            onSuccess?: (text: string) => void
            onError?: (error: Error) => void
          }
        | undefined,
    ) => ({
      isCopied: false,
      copyToClipboard: (text: string) => {
        try {
          if (text.trim()) {
            options?.onSuccess?.(text.trim())
          }
        } catch (err) {
          options?.onError?.(err as Error)
        }
      },
    }),
  ),
}))

describe('copy button', () => {
  const user = userEvent.setup({ delay: null })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should copy content to clipboard and show success toast', async () => {
    const content = 'This is a test content.'
    render(<CopyButton content={content} />)
    const copyButton = screen.getByText(/copiar/i)

    await user.click(copyButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Content copied to clipboard!')
    })
  })

  it('should show error toast when clipboard fails', async () => {
    const { useCopyToClipboard } = require('@/hooks/useCopyToClipboard')
    const mockError = new Error('Clipboard not available')

    useCopyToClipboard.mockImplementationOnce(
      (
        options:
          | {
              onSuccess?: (text: string) => void
              onError?: (error: Error) => void
            }
          | undefined,
      ) => ({
        isCopied: false,
        copyToClipboard: () => {
          options?.onError?.(mockError)
        },
      }),
    )

    const content = 'This should fail.'
    render(<CopyButton content={content} />)
    const copyButton = screen.getByText(/copiar/i)

    await user.click(copyButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        `Failed to copy: ${mockError.message}`,
      )
    })
  })

  it('should disable button when content is empty', () => {
    const { getByRole } = render(<CopyButton content="   " />)
    const button = getByRole('button')

    expect(button).toBeDisabled()
  })

  it('should call copyToClipboard with correct content', async () => {
    const { useCopyToClipboard } = require('@/hooks/useCopyToClipboard')
    const mockCopyToClipboard = jest.fn()

    useCopyToClipboard.mockImplementationOnce(() => ({
      isCopied: false,
      copyToClipboard: mockCopyToClipboard,
    }))

    const content = 'Test content for copy'
    render(<CopyButton content={content} />)
    const copyButton = screen.getByText(/copiar/i)

    await user.click(copyButton)

    expect(mockCopyToClipboard).toHaveBeenCalledWith(content)
  })

  it('should display check icon and copiado text when isCopied is true', () => {
    const { useCopyToClipboard } = require('@/hooks/useCopyToClipboard')

    useCopyToClipboard.mockImplementationOnce(() => ({
      isCopied: true,
      copyToClipboard: jest.fn(),
    }))

    const content = 'Test content'
    render(<CopyButton content={content} />)

    expect(screen.getByText('Copiado')).toBeInTheDocument()
  })

  it('should display copy icon and copiar text when isCopied is false', () => {
    const { useCopyToClipboard } = require('@/hooks/useCopyToClipboard')

    useCopyToClipboard.mockImplementationOnce(() => ({
      isCopied: false,
      copyToClipboard: jest.fn(),
    }))

    const content = 'Test content'
    render(<CopyButton content={content} />)

    expect(screen.getByText('Copiar')).toBeInTheDocument()
  })

  it('should not be disabled when content has valid text', () => {
    const content = 'Valid content'
    const { getByRole } = render(<CopyButton content={content} />)
    const button = getByRole('button')

    expect(button).not.toBeDisabled()
  })
})
