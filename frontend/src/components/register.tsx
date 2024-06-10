import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";

import React, { useState } from 'react';


function Stage1(){
  return (
    <>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="last-name">Фамилия руководителя организации</Label>
          <Input id="last-name" type="text" placeholder="Иванов" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Имя руководителя организации</Label>
          <Input id="name" type="text" placeholder="Иван" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="second-name">Отчество руководителя организации</Label>
          <Input id="second-name" type="text" placeholder="Иванович" required/>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Адрес электронной почты</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password1">Пароль</Label>
          <Input id="password1" type="password" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password2">Подтвердите пароль</Label>
          <Input id="password2" type="password" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reason">Основания</Label>
          <Input id="reason" type="text" placeholder="Действует на основании ..." required/>
        </div>
      </div>
    </>
  )
}

function Stage2() {
  return (
    <>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="short-name">Краткое наименование организации</Label>
          <Input id="short-name" type="text" placeholder="МАОУ СОШ №" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="full-name">Полное наименование организации</Label>
          <Input id="full-name" type="text" placeholder="Муниципальное автономное ..." required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="inn">ИНН организации</Label>
          <Input id="inn" type="text" placeholder="Набор из 10 цифр" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="kpp">КПП организации</Label>
          <Input id="kpp" type="text" placeholder="Набор из 9 цифр" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bic">БИК банка</Label>
          <Input id="bic" type="text" placeholder="Введите БИК" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rs">Номер расчетного счета</Label>
          <Input id="rs" type="text" placeholder="Набор из 20 цифр" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ls">Номер лицевого счета</Label>
          <Input id="ls" type="text" placeholder="Набор из 20 цифр" required/>
        </div>
      </div>
      <div className="grid gap-2 mt-4 text-center text-sm">
        <Button type="submit" className="w-full">
          Зарегистрироваться
        </Button>
      </div>
    </>
  )
}


export default function Register({ toggleComponent } : any) {
  const [showPart, setShowPartStatus] = useState(true);

  let onNextClick = () => {
    setShowPartStatus(!showPart)
  }

  return (
    <Card className="mx-auto max-w-sm w-[328px]">
      <CardHeader>
        <CardTitle className="text-2xl">Регистрация</CardTitle>
        <CardDescription>
        </CardDescription>
      </CardHeader>
      <CardContent>
        { showPart ? <Stage1/> : <Stage2/> }
        <div className="grid gap-2 mt-4 text-center text-sm">
          <Button variant="outline" className="w-full" onClick={onNextClick}>
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
      </CardContent>
    </Card>
  )
}