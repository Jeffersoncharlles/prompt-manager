import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import { PromptForm } from '@/components/prompts/prompt-form'
import { render, screen } from '@/lib/test-util'

const refreshMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const createPromptActionMock = jest.fn()

jest.mock('@/app/actions/prompt.actions', () => ({
  createPromptAction: (...data: unknown[]) => createPromptActionMock(...data),
}))

const makeSut = () => {
  return render(<PromptForm />)
}

describe('PromptForm', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(toast.success as jest.Mock).mockClear()
    ;(toast.error as jest.Mock).mockClear()
  })

  it('should create a new prompt is success', async () => {
    createPromptActionMock.mockResolvedValue({
      success: true,
      msg: 'Prompt criado com sucesso.',
    })
    makeSut()

    const titleInput = screen.getByPlaceholderText(/titulo do prompt/i)
    const contentInput = screen.getByPlaceholderText(
      'Digite o conteudo do prompt...',
    )
    const submitButton = screen.getByRole('button', { name: /salvar/i })

    await user.type(titleInput, 'New Prompt')
    await user.type(contentInput, 'This is a new prompt.')
    await user.click(submitButton)

    expect(createPromptActionMock).toHaveBeenCalledWith({
      title: 'New Prompt',
      content: 'This is a new prompt.',
    })
    expect(toast.success).toHaveBeenCalledWith('Prompt criado com sucesso.')
    expect(refreshMock).toHaveBeenCalled()
  })
  it('should create a new prompt is error', async () => {
    createPromptActionMock.mockResolvedValue({
      success: false,
      msg: 'Erro ao criar prompt.',
    })
    makeSut()

    const titleInput = screen.getByPlaceholderText(/titulo do prompt/i)
    const contentInput = screen.getByPlaceholderText(
      'Digite o conteudo do prompt...',
    )
    const submitButton = screen.getByRole('button', { name: /salvar/i })

    await user.type(titleInput, 'New Prompt')
    await user.type(contentInput, 'This is a new prompt.')
    await user.click(submitButton)

    expect(createPromptActionMock).toHaveBeenCalledWith({
      title: 'New Prompt',
      content: 'This is a new prompt.',
    })
    expect(toast.error).toHaveBeenCalledWith('Erro ao criar prompt.')
  })
})
