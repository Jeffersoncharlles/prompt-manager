import {
  PromptCard,
  type PromptCardProps,
} from '@/components/prompts/prompt-card'
import { render, screen } from '@/lib/test-util'

const makeSut = ({ prompt }: PromptCardProps) => {
  render(<PromptCard prompt={prompt} />)
}

describe('PromptCard Component', () => {
  it('should render link is href current', () => {
    const prompt = { id: '1', title: 'Prompt 1', content: 'Content 1' }
    makeSut({ prompt })

    const linkElement = screen.getByRole('link')

    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', `/prompts/${prompt.id}`)
  })
})
