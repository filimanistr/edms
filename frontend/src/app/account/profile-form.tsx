"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { incline } from 'lvovich';
import { updateCounterparty } from "@/app/counterparties/api";
import { ProfileFormValues, profileFormSchema } from "./types"
import { last } from "lodash"

export function ProfileForm({user} : {user: Partial<ProfileFormValues>}) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user,
    mode: "onChange",
  })

  const onSubmit = async (data: ProfileFormValues) => {
    let title: string;
    let description: string = "";

    const name = incline({
      first: data.head_first_name,
      last: data.head_last_name,
      middle: data.head_middle_name
    }, 'genitive');

    if (name.first && name.last && name.middle) {
      data.head_pos_first_name = name.first;
      data.head_pos_last_name = name.last;
      data.head_pos_middle_name = name.middle; 
      const r = await updateCounterparty(data);
      title = r.message
    } else {
      title = "Что то пошло не так"
      description = "Убедитесь что вы вписали настоящие данные"
    }

    toast({
      title: title,
      description: description,
    })
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="head_last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Фамилия руководителя организации</FormLabel>
              <FormControl>
                <Input placeholder="Иванов" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="head_first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя руководителя организации</FormLabel>
              <FormControl>
                <Input placeholder="Иван" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="head_middle_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Отчество руководителя организации</FormLabel>
              <FormControl>
                <Input placeholder="Иванович" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Адрес электронной почты</FormLabel>
              <FormControl>
                <Input placeholder="example@yandex.ru" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Основание на котором действует руководитель организации</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Действует на основании ..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="sm" className='mr-2'>Сохранить</Button>

      </form>
    </Form>
  )
}