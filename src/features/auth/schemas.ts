import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .email('Informe um e-mail válido'),
  password: z
    .string()
    .min(4, 'A senha deve ter pelo menos 4 caracteres'),
})

export const loginSchema = z.object({
  email: z
    .string()
    .email('Informe um e-mail válido'),
  password: z
    .string()
    .min(1, 'Informe sua senha'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
