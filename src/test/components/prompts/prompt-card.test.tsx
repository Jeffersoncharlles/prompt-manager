import userEvent from '@testing-library/user-event'
import {
  PromptCard,
  type PromptCardProps,
} from '@/components/prompts/prompt-card'
import { render, screen } from '@/lib/test-util'

const makeSut = ({ prompt }: PromptCardProps) => {
  render(<PromptCard prompt={prompt} />)
}

describe('PromptCard Component', () => {
  const user = userEvent.setup()

  it('should render link is href current', () => {
    const prompt = { id: '1', title: 'Prompt 1', content: 'Content 1' }
    makeSut({ prompt })

    const linkElement = screen.getByRole('link')

    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', `/prompts/${prompt.id}`)
  })
  it('should be able dialog when click on delete button', async () => {
    const prompt = { id: '1', title: 'Prompt 1', content: 'Content 1' }
    makeSut({ prompt })

    const deleteButton = screen.getByRole('button', { name: /remover prompt/i })
    // expect(deleteButton).toBeInTheDocument()

    await user.click(deleteButton)

    expect(screen.getByText('Remover Prompt')).toBeInTheDocument()
  })
})
