import Logo from '@/components/logo/logo'
import { render, screen } from '@/lib/test-util'

const makeSut = () => {
  render(<Logo />)
}

describe('Logo Component', () => {
  it('should render link for home page', () => {
    makeSut()

    const linkElement = screen.getByRole('link')

    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', '/')
  })
})
