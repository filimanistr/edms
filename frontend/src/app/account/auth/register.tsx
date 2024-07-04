import { useState } from 'react';
import {
  Card,
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RegistrationValues, RegistrationSchema } from "@/app/account/types"
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { incline } from 'lvovich';
import { toast } from "@/components/ui/use-toast"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createCounterparty } from "@/app/account/api";
import _ from 'lodash';
import { useRouter } from 'next/navigation'

function Stage1({className="", form}: any){
  return (
    <div className={className}>
      <div className="grid gap-4">
        
        <FormField
          control={form.control}
          name="head_last_name"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>Фамилия руководителя организации</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} placeholder="Иванов" {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="head_first_name"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>Имя руководителя организации</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} placeholder="Иван" {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="head_middle_name"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>Отчество руководителя организации</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} placeholder="Иванович" {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>Адрес электронной почты</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} placeholder="example@yandex.ru" {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>Пароль</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} type="password" {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>Подтвердите пароль</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} type="password" {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>Основания</FormLabel>
              <FormControl className="m-0">
                <Input style={{ marginTop: 0 }} placeholder="Действует на основании ..." {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

      </div>
    </div>
  )
}

function Stage2({className="", form}: any) {
  return (
    <div className={className}>
      <div className="grid gap-4">

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>Краткое наименование организации</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} placeholder="МАОУ СОШ №" {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>Полное наименование организации</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} placeholder="Муниципальное автономное ..." {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="INN"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>ИНН организации</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} placeholder="Набор из 10 цифр" {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="KPP"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>КПП организации</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} placeholder="Набор из 9 цифр" {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="BIC"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>БИК банка</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} placeholder="Введите БИК" {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="checking_account"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>Номер расчетного счета</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} placeholder="Набор из 20 цифр" {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="personal_account"
          render={({ field }) => (
            <FormItem className="grid gap-2 mt-0">
              <FormLabel className='text-inherit'>Номер лицевого счета</FormLabel>
              <FormControl>
                <Input style={{ marginTop: 0 }} placeholder="Набор из 20 цифр" {...field} />
              </FormControl>
              <FormMessage style={{ marginTop: 0 }} />
            </FormItem>
          )}
        />

      </div>

      <div className="grid gap-2 mt-4 text-center text-sm">
        <Button type="submit" className="w-full">
          Зарегистрироваться
        </Button>
      </div>

    </div>
  )
}

export default function Register({ toggleComponent } : any) {
  const router = useRouter()

  const [showPart, setShowPartStatus] = useState(true);
  const form = useForm<RegistrationValues>({
    resolver: zodResolver(RegistrationSchema),
    mode: "onChange",
  })

  let onNextClick = () => {
    setShowPartStatus(!showPart)
  }

  const onSubmit = async (data: RegistrationValues) => {
    const name = incline({
      first: data.head_first_name,
      last: data.head_last_name,
      middle: data.head_middle_name
    }, 'genitive');

    const rename = _.mapKeys(
      name, (value, key) => `head_pos_${key}_name`
    );

    const r = await createCounterparty(data={...data, ...rename});
  
    if (r === true) {
      router.push("/")
    } else {
      // TODO: Все еще могут быть ошибки при вводе пароля
      // console.log("r: ", r)
      toast({
        variant: "destructive",
        title: r.message,
        description: r.description
      })
    }
  }

  return (
    <div>
      <Card className="mx-auto max-w-sm w-[328px]">
        <CardHeader>
          <CardTitle className="text-2xl">Регистрация</CardTitle>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardContent>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Stage1 className={showPart ? "block" : "hidden"} form={form}/>
              <Stage2 className={showPart ? "hidden" : "block"} form={form}/>
              <div className="grid gap-2 mt-4 text-center text-sm">
                <Button type="button" variant="outline" className="w-full" onClick={onNextClick}>
                  { showPart ? "Продолжить" : "Вернуться" }
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                <div className="inline-block" onClick={toggleComponent}>
                  { /* Don&apos;t have an account?{" "} */}
                  <Link href="#" className="underline">
                    Войти
                  </Link>
                </div>
              </div>
            </form>
          </Form>

        </CardContent>
      </Card>
    </div>
  )
}
