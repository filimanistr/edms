import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation"
import {useToast} from "@/components/ui/use-toast"
import {useState} from "react";

import {getToken} from "@/app/account/api";

export default function Login({ toggleComponent }: any) {
  const { toast } = useToast()
  const router = useRouter()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = {
    email: email,
    password: password
  };

  async function handleClick(event:any) {
    // Получение JWT токена с сервера
    // Форматирование текста ошибки
    event.preventDefault();
    let r = await getToken(user);
    if (r === true) {
      router.push("/")
    } else {
      toast({
        variant: "destructive",
        title: r.detail,
        description: "",
      })
    }
  }

  return (
    <form onSubmit={handleClick}>
    <Card className="mx-auto max-w-sm w-[328px]">
      <CardHeader>
        <CardTitle className="text-2xl">Вход</CardTitle>
        <CardDescription>
          {/* Введите вашу почту для того чтобы войти */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Почта</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Пароль</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Забыли пароль?
              </Link>
            </div>
            <Input id="password"
                   type="password"
                   required
                   onChange={e => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit"
                  className="w-full"
                  >
            Войти
          </Button>
        </div>
        <div className="mt-4 text-center text-sm ">
          <div className="inline-block" onClick={toggleComponent}>
            { /* Don&apos;t have an account?{" "} */}
            <Link href="#" className="underline">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
    </form>
  )
}