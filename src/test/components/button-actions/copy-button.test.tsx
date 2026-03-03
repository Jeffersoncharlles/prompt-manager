import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { toast } from 'sonner'
import { CopyButton } from '@/components/button-actions/copy-button'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
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
      copyToClipboard: async (text: string) => {
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

type CopyButtonTestProps = ComponentProps<typeof CopyButton>

const mockedUseCopyToClipboard = useCopyToClipboard as jest.MockedFunction<
  typeof useCopyToClipboard
>

const makeSut = (props: Partial<CopyButtonTestProps> = {}) => {
  const mergedProps: CopyButtonTestProps = {
    content: 'Test content',
    ...props,
  }

  const view = render(<CopyButton {...mergedProps} />)

  return {
    ...view,
    content: mergedProps.content,
  }
}

describe('copy button', () => {
  const user = userEvent.setup({ delay: null })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should copy content to clipboard and show success toast', async () => {
    makeSut({ content: 'This is a test content.' })
    const copyButton = screen.getByText(/copiar/i)

    await user.click(copyButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Content copied to clipboard!')
    })
  })

  it('should show error toast when clipboard fails', async () => {
    const mockError = new Error('Clipboard not available')

    mockedUseCopyToClipboard.mockImplementationOnce(
      (
        options:
          | {
              onSuccess?: (text: string) => void
              onError?: (error: Error) => void
            }
          | undefined,
      ) => ({
        isCopied: false,
        copyToClipboard: async (_text?: string) => {
          options?.onError?.(mockError)
        },
      }),
    )

    makeSut({ content: 'This should fail.' })
    const copyButton = screen.getByText(/copiar/i)

    await user.click(copyButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        `Failed to copy: ${mockError.message}`,
      )
    })
  })

  it('should disable button when content is empty', () => {
    const { getByRole } = makeSut({ content: '   ' })
    const button = getByRole('button')

    expect(button).toBeDisabled()
  })

  it('should call copyToClipboard with correct content', async () => {
    const mockCopyToClipboard = jest.fn()

    mockedUseCopyToClipboard.mockImplementationOnce(() => ({
      isCopied: false,
      copyToClipboard: mockCopyToClipboard,
    }))

    const { content } = makeSut({ content: 'Test content for copy' })
    const copyButton = screen.getByText(/copiar/i)

    await user.click(copyButton)

    expect(mockCopyToClipboard).toHaveBeenCalledWith(content)
  })

  it('should display check icon and copiado text when isCopied is true', () => {
    mockedUseCopyToClipboard.mockImplementationOnce(() => ({
      isCopied: true,
      copyToClipboard: jest.fn(),
    }))

    makeSut({ content: 'Test content' })

    expect(screen.getByText('Copiado')).toBeInTheDocument()
  })

  it('should display copy icon and copiar text when isCopied is false', () => {
    mockedUseCopyToClipboard.mockImplementationOnce(() => ({
      isCopied: false,
      copyToClipboard: jest.fn(),
    }))

    makeSut({ content: 'Test content' })

    expect(screen.getByText('Copiar')).toBeInTheDocument()
  })

  it('should not be disabled when content has valid text', () => {
    const { getByRole } = makeSut({ content: 'Valid content' })
    const button = getByRole('button')

    expect(button).not.toBeDisabled()
  })
})
