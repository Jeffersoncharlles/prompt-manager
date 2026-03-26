import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import {
  PromptCard,
  type PromptCardProps,
} from '@/components/prompts/prompt-card'
import { render, screen } from '@/lib/test-util'

const makeSut = ({ prompt }: PromptCardProps) => {
  render(<PromptCard prompt={prompt} />)
}

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const deleteMock = jest.fn()
jest.mock('@/app/actions/prompt.actions', () => ({
  deletePromptAction: (id: string) => deleteMock(id),
}))

describe('PromptCard Component', () => {
  const user = userEvent.setup()
  const promptData = {
    id: 'clx1234567890abcdef12345',
    title: 'Prompt 1',
    content: 'Content 1',
  }

  it('should render link is href current', () => {
    const prompt = promptData
    makeSut({ prompt })

    const linkElement = screen.getByRole('link')

    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', `/prompts/${prompt.id}`)
  })
  it('should be able dialog when click on delete button', async () => {
    const prompt = promptData
    makeSut({ prompt })

    const deleteButton = screen.getByRole('button', { name: /remover prompt/i })
    expect(deleteButton).toBeInTheDocument()

    await user.click(deleteButton)

    expect(screen.getByText('Remover Prompt')).toBeInTheDocument()
  })
  it('should successfully remove and display the toast', async () => {
    deleteMock.mockResolvedValueOnce({
      success: true,
      msg: 'Prompt removido com sucesso.',
    })
    const prompt = promptData
    makeSut({ prompt })

    const deleteButton = screen.getByRole('button', { name: /remover prompt/i })
    await user.click(deleteButton)
    await user.click(screen.getByRole('button', { name: /Confirmar Remoção/i }))

    expect(toast.success).toHaveBeenCalledWith('Prompt removido com sucesso.')
  })
  it('should handle error and display the toast', async () => {
    deleteMock.mockResolvedValueOnce({
      success: false,
      msg: 'Erro ao remover o prompt.',
    })
    const prompt = promptData
    makeSut({ prompt })

    const deleteButton = screen.getByRole('button', { name: /remover prompt/i })
    await user.click(deleteButton)
    await user.click(screen.getByRole('button', { name: /Confirmar Remoção/i }))

    expect(toast.error).toHaveBeenCalledWith('Erro ao remover o prompt.')
  })
})
