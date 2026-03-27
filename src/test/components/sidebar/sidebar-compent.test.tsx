import userEvent from '@testing-library/user-event'
import {
  SidebarContent,
  type SidebarContentProps,
} from '@/components/sidebar/sidebar-content'
import { render, screen, waitFor } from '@/lib/test-util'

const mockedSearchPromptAction = jest.fn().mockResolvedValue({
  success: true,
  prompts: [],
})

jest.mock('@/app/actions/prompt.actions', () => ({
  searchPromptAction: (...args: unknown[]) => mockedSearchPromptAction(...args),
}))

// Mock prisma to avoid TextEncoder error in JSDOM
jest.mock('@/lib/prisma', () => ({
  prisma: {
    prompt: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  },
}))

const pushMock = jest.fn()
let mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => {
    return mockSearchParams
  },
}))

const initialPrompts = [
  { id: '01', title: 'Prompt 1', content: 'Conteúdo do Prompt 1' },
]

const makeSut = (
  { prompts = initialPrompts }: SidebarContentProps = {} as SidebarContentProps,
) => {
  render(<SidebarContent prompts={prompts} />)
}

// const expectSidebarState = (isCollapsed: boolean) => {
//   // Sidebar.Root é <aside aria-label="sidebar content">
//   const aside = screen.getByLabelText(/sidebar content/i)
//   expect(aside).toHaveAttribute(
//     'data-collapsed',
//     isCollapsed ? 'true' : 'false',
//   )
// }

describe('Sidebar content', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockSearchParams = new URLSearchParams()
    pushMock.mockClear()
    mockedSearchPromptAction.mockClear()
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  describe('Initial base', () => {
    it('should render a new prompt button', async () => {
      makeSut()

      expect(screen.getByRole('button', { name: /novo prompt/i })).toBeVisible()
    })

    it('should render the list prompts', async () => {
      const input = [
        ...initialPrompts,
        { id: '02', title: 'Prompt 2', content: 'Conteúdo do Prompt 2' },
      ]
      makeSut({ prompts: input })

      expect(screen.getByText(input[0].title)).toBeInTheDocument()
    })
    it('should update the search results when prompts are added', async () => {
      makeSut()
      const searchInput = screen.getByPlaceholderText(/buscar prompts.../i)

      await user.type(searchInput, 'Prompt 1')
      await waitFor(() => {
        expect(mockedSearchPromptAction).toHaveBeenCalled()
      })

      expect(searchInput).toHaveValue('Prompt 1')
    })
  })

  /*----------------------------*/
  describe('Collapse / expand sidebar ', () => {
    it('should start expanded and display the minimize button.', async () => {
      makeSut()

      const aside = screen.getByRole('complementary')
      expect(aside).toHaveAttribute('data-collapsed', 'false')

      const collapseButton = screen.getByRole('button', {
        name: /minimizar menu/i,
      })
      expect(collapseButton).toBeInTheDocument()

      const expandButton = screen.queryByRole('button', {
        name: /expandir menu/i,
        hidden: true,
      })
      expect(expandButton).toBeInTheDocument()
    })

    it('should collapse when minimize button is clicked', async () => {
      makeSut()

      const collapseButton = screen.getByRole('button', {
        name: /minimizar menu/i,
      })
      await user.click(collapseButton)

      const aside = screen.getByRole('complementary')
      expect(aside).toHaveAttribute('data-collapsed', 'true')
    })

    it('should expand when maximize button is clicked', async () => {
      makeSut()

      // Colapsa primeiro
      const collapseButton = screen.getByRole('button', {
        name: /minimizar menu/i,
      })
      await user.click(collapseButton)

      // Encontra o botão de expandir (ele aparece quando collapsed=true)
      // Como ele tem a classe 'hidden' no Root inicial, precisamos do hidden: true
      const expandButton = screen.getByRole('button', {
        name: /expandir menu/i,
      })

      await user.click(expandButton)

      const aside = screen.getByRole('complementary')
      expect(aside).toHaveAttribute('data-collapsed', 'false')
    })

    it('should Display the "Create a new prompt" button in the minimized sidebar.', async () => {
      makeSut()
      const collapseButton = screen.getByRole('button', {
        name: /Minimizar menu/i,
      })
      await user.click(collapseButton)

      const newPromptButton = screen.getByRole('button', {
        name: /novo prompt/i,
      })
      expect(newPromptButton).toBeVisible()
    })
    it('should not The list of prompts  be displayed in the minimized sidebar.', async () => {
      makeSut()
      const collapseButton = screen.getByRole('button', {
        name: /Minimizar menu/i,
      })
      await user.click(collapseButton)

      // Sidebar.SectionNav tem aria-label="Lista de prompts"
      const promptList = screen.queryByLabelText(/lista de prompts/i)
      expect(promptList).not.toBeInTheDocument()
    })
  })
  /*----------------------------*/
  describe('New Prompt button', () => {
    it('should navigate to /prompts/new when clicked', async () => {
      makeSut()

      const newPromptButton = screen.getByRole('button', {
        name: /novo prompt/i,
      })
      await user.click(newPromptButton)

      expect(pushMock).toHaveBeenCalledWith('/prompts/new')
    })
  })

  describe('Search input', () => {
    it('should navigate using the modified URL when typing and clearing.', async () => {
      makeSut()
      const searchInput = screen.getByPlaceholderText(/buscar prompts.../i)

      await user.type(searchInput, 'Prompt 1')
      await waitFor(() => {
        expect(mockedSearchPromptAction).toHaveBeenCalled()
      })

      expect(pushMock).toHaveBeenCalled()

      const lastCall = pushMock.mock.calls.at(-1)

      expect(lastCall?.[0]).toBe('/?q=Prompt%201')

      await user.clear(searchInput)

      const lastClearCall = pushMock.mock.calls.at(-1)
      expect(lastClearCall?.[0]).toBe('/')
    })

    it('should start the search field with the search parameters.', async () => {
      const text = 'prompt1'
      const url = new URLSearchParams(`q=${text}`)
      mockSearchParams = url
      makeSut()

      const searchInput = screen.getByPlaceholderText(/buscar prompts.../i)
      await waitFor(() => {
        expect(mockedSearchPromptAction).toHaveBeenCalled()
      })
      expect(searchInput).toHaveValue(text)
    })

    it('should display original prompts list when no search query is active', async () => {
      const customPrompts = [
        { id: '01', title: 'Custom Prompt 1', content: 'Content 1' },
        { id: '02', title: 'Custom Prompt 2', content: 'Content 2' },
      ]
      makeSut({ prompts: customPrompts })
      const searchInput = screen.getByPlaceholderText(/buscar prompts.../i)

      expect(searchInput).toHaveValue('')
      expect(screen.getByText('Custom Prompt 1')).toBeInTheDocument()
      expect(screen.getByText('Custom Prompt 2')).toBeInTheDocument()
    })

    it('should fallback to original prompts when query is active and search result has no prompts', async () => {
      mockedSearchPromptAction.mockResolvedValue({
        success: false,
        msg: 'Erro ao buscar prompts',
      })

      const customPrompts = [
        { id: '01', title: 'Custom Prompt 1', content: 'Content 1' },
      ]

      makeSut({ prompts: customPrompts })
      const searchInput = screen.getByPlaceholderText(/buscar prompts.../i)

      await user.type(searchInput, 'Custom')

      await waitFor(() => {
        expect(mockedSearchPromptAction).toHaveBeenCalled()
      })

      expect(screen.getByText('Custom Prompt 1')).toBeInTheDocument()
    })
  })
})
