"use client"

import {useToast} from "@/components/ui/use-toast";
import {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation"
import CurrencyInput from 'react-currency-input-field';

import { createService } from "./api";

export function CreateNewServiceWindow(props: any) {
  const currentYear = new Date().getFullYear();

  const { toast } = useToast()
  const [disable, setDisable] = useState(true)         // Отображение кнопки сохранения
  const [open, setOpen] = useState(false)               // Отображение формы
  const [show, setShow] = useState(false);              // Отображение строк выбора

  // Выбранные значения
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [year, setYear] = useState<number>(currentYear);

  const router = useRouter();

  const handleClose = () => {
    if (name !== "" && price !== 0 && year !== 0 ) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }

  useEffect(() => {
    handleClose();
  }, [name, price, year]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {props.children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]"
                     autoFocus={false}
                     onOpenAutoFocus={async (event) => {
                       event.preventDefault();
                       setShow(true);
                     }}
                     onCloseAutoFocus={() => {
                       setName("");
                       setPrice(0);
                       setYear(currentYear);
                     }}
      >
        <DialogHeader>
          <DialogTitle>Создать новую услугу</DialogTitle>
          <DialogDescription>
            Необходимо заполнить следующие поля для созздания новой услуги
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Название
            </Label>
            <Input type="text"
                   placeholder="Разработка системы"
                   required
                   className=" items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between"
                   onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Цена
            </Label>
            <CurrencyInput
              required
              id="input-example"
              name="input-name"
              placeholder="1000.00"
              decimalsLimit={2}
              className="items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between"
              onValueChange={(value, name, values) => {
                // console.log(value, name, values)
                if (values) setPrice(+values.value)
              }}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Год
            </Label>
            <Input type="number"
                   defaultValue={year}
                   placeholder={currentYear.toString()}
                   required
                   className=" items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between"
                   onChange={e => setYear(+e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            disabled={disable}
            onClick={async () => {
              await createService({
                name: name,
                price: price,
                year: year
              })

              router.refresh()
              setOpen(false);
              setName("");
              setPrice(0);
              setYear(0);
              toast({
                description: "Новая услуга была создана успешно"
              })
            }}
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}