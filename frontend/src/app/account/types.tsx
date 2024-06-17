import { z } from "zod"

/* Настройки */

const stringValidation = (max: number) => z
  .string({required_error: `Поле не должно оставаться пустым`})
  .trim()
  .max(max, `Поле не может превышать ${max} символов`)
  .min(1, `Поле не должно оставаться пустым`);

export const profileFormSchema = z.object({
  head_last_name: stringValidation(40),
  head_first_name: stringValidation(20),
  head_middle_name: stringValidation(20),

  // На деле не отображаются, но нужны для того
  // чтобы сунуть в переменную с этим типом эти поля
  head_pos_first_name: z.string(),
  head_pos_last_name: z.string(),
  head_pos_middle_name: z.string(),

  email: z
    .string({required_error: "Поле не должно оставаться пустым",})
    .max(30, `Поле не может превышать 30 символов`)
    .email(),
  reason: z
    .string({required_error: "Поле не должно оставаться пустым",})
    .max(300, `Поле не может превышать 300 символов`)

});

export type ProfileFormValues = z.infer<typeof profileFormSchema>

/* Регистрация */

export const RegistrationSchema = z.object({
  head_last_name: stringValidation(40),
  head_first_name: stringValidation(20),
  head_middle_name: stringValidation(20),
  email: z
    .string({required_error: "Поле не должно оставаться пустым"})
    .email("Строка не является почтой")
    .max(30, `Поле не может превышать 30 символов`),
  password: z
    .string({required_error: "Поле не должно оставаться пустым"})
    .max(30, `Поле не может превышать 30 символов`)
    .min(8, "Поле должно содержать не меньше 8 символов"),
  confirmPassword: z
    .string({required_error: "Поле не должно оставаться пустым",}),
  reason: stringValidation(300),
  
  name: stringValidation(150),
  full_name: stringValidation(300),
  INN: stringValidation(10),
  KPP: stringValidation(9),
  BIC: stringValidation(10),
  checking_account: stringValidation(20),
  personal_account: stringValidation(20),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "Пароль не совпадает",
      path: ['confirmPassword']
    });
  }
});

export type RegistrationValues = z.infer<typeof RegistrationSchema>
