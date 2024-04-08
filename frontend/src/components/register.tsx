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
          <Label htmlFor="name">Имя</Label>
          <Input id="name" type="text" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last-name">Фамилия</Label>
          <Input id="last-name" type="text" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="second-name">Отчество</Label>
          <Input id="second-name" type="text" required/>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Почта</Label>
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
          <Label htmlFor="password2">Повторите пароль</Label>
          <Input id="password2" type="password" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reason">Основания</Label>
          <Input id="reason" type="text" required/>
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
          <Label htmlFor="short-name">Короткое наименование организации</Label>
          <Input id="short-name" type="text" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="full-name">Полное наименование организации</Label>
          <Input id="full-name" type="text" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="inn">ИНН</Label>
          <Input id="inn" type="text" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="kpp">КПП</Label>
          <Input id="kpp" type="text" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bic">БИК</Label>
          <Input id="bic" type="text" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rs">р/с</Label>
          <Input id="rs" type="text" required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ls">л/с</Label>
          <Input id="ls" type="text" required/>
        </div>
      </div>
      <div className="grid gap-2 mt-4 text-center text-sm">
        <Button type="submit" className="w-full">
          Зарегестрироваться
        </Button>
      </div>
    </>
  )
}


export default function Register({ toggleComponent }) {
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
            { showPart ? "Продолжить" : "Венуться" }
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