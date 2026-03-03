import {
  PromptList,
  type PromptListProps,
} from '@/components/prompts/prompt-list'

import { render, screen } from '@/lib/test-util'

const makeSut = ({ prompts }: PromptListProps) => {
  render(<PromptList prompts={prompts} />)
}

describe('PromptList Component', () => {
  it('should render the list of prompts', () => {
    const prompts = [
      { id: '1', title: 'Prompt 1', content: 'Content 1' },
      { id: '2', title: 'Prompt 2', content: 'Content 2' },
    ]

    makeSut({ prompts })

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(prompts.length)
    expect(screen.getByText('Prompt 1')).toBeInTheDocument()
    expect(screen.getByText('Prompt 2')).toBeInTheDocument()
  })
  it('should render the prompt list when it is empty', () => {
    const prompts = [] as PromptListProps['prompts']

    makeSut({ prompts })

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
