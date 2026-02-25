import { type RenderOptions, render } from '@testing-library/react'

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { ...options })
}

export * from '@testing-library/react'
export { customRender as render }
