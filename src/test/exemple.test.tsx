import { render, screen } from '@/lib/test-util'

describe('example test', () => {
  it('should pass', () => {
    render(<div>test</div>)
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
