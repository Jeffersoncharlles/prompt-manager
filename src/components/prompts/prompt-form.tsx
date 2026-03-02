import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

export const PromptForm = () => {
  return (
    <form className="space-y-6">
      <header className="flex flex-wrap gap-2 items-center mb-6 justify-end">
        <Button type="submit" size={'sm'}>
          Salvar
        </Button>
      </header>

      <Input
        variant={'transparent'}
        placeholder="Titulo do prompt"
        size={'lg'}
        autoFocus
      />

      <Textarea
        variant={'transparent'}
        placeholder="Digite o conteudo do prompt..."
        size={'lg'}
      />
    </form>
  )
}
