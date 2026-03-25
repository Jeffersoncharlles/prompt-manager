'use server'

import z from 'zod'
import {
  type CreatePromptDto,
  createPromptSchema,
} from '@/core/application/prompts/create-prompt.dto'
import { CreatePromptUseCase } from '@/core/application/prompts/create-prompt.use-case'
import { GetAllPromptsUseCase } from '@/core/application/prompts/get-all-prompts.use-case'
import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts.use-case'
import {
  type UpdatePromptDto,
  updatePromptSchema,
} from '@/core/application/prompts/update-prompt.dto'
import { UpdatePromptUseCase } from '@/core/application/prompts/update-prompt.use-case'
import { ConflictError, ResourceNotFoundError } from '@/core/errors/app-errors'
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository'
import { prisma } from '@/lib/prisma'
import type {
  CreatePromptState,
  FormState,
  GetAllPromptsState,
  SearchFormState,
} from './prompt-actions.types'

// #region Search Prompts Action
export const searchPromptAction = async (
  _prev: SearchFormState,
  formData: FormData,
): Promise<SearchFormState> => {
  const term = String(formData.get('q') ?? '').trim()

  const repository = new PrismaPromptRepository(prisma)
  const useCase = new SearchPromptsUseCase(repository)

  try {
    const result = await useCase.execute(term)

    const summaries = result.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
    }))

    return {
      success: true,
      prompts: summaries,
    }
  } catch (_error) {
    return {
      success: false,
      msg: 'Ocorreu um erro ao buscar os prompts.',
    }
  }
}
// #endregion

// #region Get All Prompts Action
export const getAllPrompts = async (): Promise<GetAllPromptsState> => {
  const repository = new PrismaPromptRepository(prisma)
  const useCase = new GetAllPromptsUseCase(repository)

  try {
    const prompts = await useCase.execute()
    return {
      success: true,
      prompts,
    }
  } catch (_error) {
    return {
      success: false,
      prompts: [],
      msg: 'Erro ao buscar prompts.',
    }
  }
}
// #endregion

// #region Create Prompt Action
export const createPromptAction = async (
  data: CreatePromptDto,
): Promise<CreatePromptState> => {
  const validated = createPromptSchema.safeParse(data)

  if (!validated.success) {
    const { fieldErrors } = z.flattenError(validated.error)
    return {
      success: false,
      msg: 'Dados inválidos.',
      errors: fieldErrors,
    }
  }

  try {
    const repository = new PrismaPromptRepository(prisma)
    const useCase = new CreatePromptUseCase(repository)
    await useCase.execute(validated.data)

    return {
      success: true,
      msg: 'Prompt criado com sucesso.',
    }
  } catch (error) {
    const _error = error as Error
    if (_error.message === 'Prompt_with_this_title_already_exists.') {
      return {
        success: false,
        msg: 'Já existe um prompt com este título.',
      }
    }
    return {
      success: false,
      msg: 'Ocorreu um erro ao criar o prompt.',
    }
  }
}
// #endregion

// #region Update Prompt Action
export const updatePromptAction = async (
  data: UpdatePromptDto,
): Promise<FormState> => {
  const validated = updatePromptSchema.safeParse(data)

  if (!validated.success) {
    const { fieldErrors } = z.flattenError(validated.error)
    return {
      success: false,
      msg: 'Dados inválidos.',
      errors: fieldErrors,
    }
  }

  try {
    const repository = new PrismaPromptRepository(prisma)
    const useCase = new UpdatePromptUseCase(repository)
    await useCase.execute({ ...validated.data })

    return {
      success: true,
      msg: 'Prompt atualizado com sucesso.',
    }
  } catch (error) {
    const _error = error as Error
    if (_error instanceof ResourceNotFoundError) {
      return {
        success: false,
        msg: 'Prompt não encontrado.',
      }
    }

    if (error instanceof ConflictError) {
      return {
        success: false,
        msg: 'Já existe um prompt com este título.',
      }
    }

    return {
      success: false,
      msg: 'Ocorreu um erro ao atualizar o prompt.',
    }
  }
}
// #endregion
