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

const expectSidebarState = (isCollapsed: boolean) => {
  const aside = screen.getByRole('complementary')
  expect(aside).toHaveAttribute(
    'data-collapsed',
    isCollapsed ? 'true' : 'false',
  )
}

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
      expect(
        screen.getByRole('button', { name: /^Novo Prompt$/i }),
      ).toBeVisible()
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
      expectSidebarState(false)

      const aside = screen.getByRole('complementary')

      expect(aside).toBeVisible()

      const collapseButton = screen.getByRole('button', {
        name: /Minimizar menu/i,
      })

      expect(collapseButton).toBeVisible()

      const expandButton = screen.queryByRole('button', {
        name: /Expandir menu/i,
      })

      expect(expandButton).toBeInTheDocument()
    })

    it('should collapse when minimize button is clicked', async () => {
      makeSut()

      const collapseButton = screen.getByRole('button', {
        name: /Minimizar menu/i,
      })
      await user.click(collapseButton)

      expectSidebarState(true)
    })
    it('should expand when maximize button is clicked', async () => {
      makeSut()

      const collapseButton = screen.getByRole('button', {
        name: /Minimizar menu/i,
      })
      await user.click(collapseButton)

      expectSidebarState(true)

      const expandButton = await screen.findByRole('button', {
        name: /Expandir menu/i,
        hidden: true, // permite encontrar mesmo se "oculto"
      })

      // verifica que existe no DOM
      expect(expandButton).toBeInTheDocument()

      await user.click(expandButton)

      //  verifica mudança de estado
      expectSidebarState(false)
    })

    it('should Display the "Create a new prompt" button in the minimized sidebar.', async () => {
      makeSut()
      const collapseButton = screen.getByRole('button', {
        name: /Minimizar menu/i,
      })
      await user.click(collapseButton)

      const newPromptButton = screen.getByRole('button', {
        name: /^Novo prompt$/i,
      })
      expect(newPromptButton).toBeVisible()
    })
    it('should not The list of prompts  be displayed in the minimized sidebar.', async () => {
      makeSut()
      const collapseButton = screen.getByRole('button', {
        name: /Minimizar menu/i,
      })
      await user.click(collapseButton)

      const promptList = screen.queryByRole('navigation', {
        name: /Lista de prompts/i,
      })
      expect(promptList).not.toBeInTheDocument()
    })
  })
  /*----------------------------*/
  describe('New Prompt button', () => {
    it('should navigate to /prompts/new when clicked', async () => {
      makeSut()

      const newPromptButton = screen.getByRole('button', {
        name: /^Novo prompt$/i,
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
