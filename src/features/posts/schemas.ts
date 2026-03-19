import { z } from 'zod';

export const postSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres.'),
  content: z
    .string()
    .min(1, 'O conteúdo não pode estar vazio.'),
  image: z
    .string()
    .url('Insira uma URL de imagem válida.')
    .optional()
    .or(z.literal('')),
});

export type PostFormData = z.infer<typeof postSchema>;
