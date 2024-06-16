import { z } from "zod"

const stringValidation = (label: string) => z
  .string({required_error: `Поле ${label} не должно оставаться пустым`,})
  .trim()
  .max(20, `Поле ${label} не может превышать 20 символов`)
  .min(1, `Поле ${label} не должно оставаться пустым`);

export const profileFormSchema = z.object({
  head_last_name: stringValidation('Фамилия'),
  head_first_name: stringValidation('Имя'),
  head_middle_name: stringValidation('Отчество'),

  // На деле не отображаются, но нужны для того
  // чтобы сунуть в переменную с этим типом эти поля
  head_pos_first_name: z.string(),
  head_pos_last_name: z.string(),
  head_pos_middle_name: z.string(),

  email: z
    .string({
      required_error: "Поле не должно оставаться пустым",
    })
    .email()
    .max(30, `Поле не может превышать 30 символов`),

  reason: z.string().max(300).min(4),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
