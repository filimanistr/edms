"use client"

interface ComboboxProps<> {
  data: []                                // Данные из которых идет выборка
  default_value: string
  not_found: string
  value: number                           // Выбранное поле, id этой записи тут
  setValue: any                           // Направить id в хук с той стороны компонента
  input_placeholder?: string
}

