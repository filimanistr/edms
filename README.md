# Система договоров с образовательными учреждениями


## Технические сведения:

1. Аутентификация

   Кастомный класс User создан для того чтобы вход был только по почте
   она и является уникальным идентификатором всех пользователей

   Таблица контрагентов связанна с таблицей User связью 1 к 1
   То-есть, User создается с записью в контрагентах,
   но может и без нее, быть самостоятельным

   Используется авторизация на основе токенов
   необходимо пересмотреть

## TODO:

Регистрация
Шаблоны давать создавать юзерам
Вставка данных исполнителя

1. Дать редактировать шаблон контрагентам
2. Preview contracts before creating
3. History of changes

0. удалять шаблоны, но не договора
0. особые правила при удалении договоров: можно если 2 стороны согласны

1. Формировать закрывающие документы
2. Создавать контрагентов за них
3. Меню настроек и там данные ключей
4. Исправить пагинацию с сервера
5. Главная страница с долгом 
6. Dockerize the thing 
7. WebSockets применить чтобы статусы договоров обновлять без перезагрузки 
8. Аутентификация, рассмотреть другие варианты 
9. Электронная подпись 
10. Тесты 
11. swagger

There is some troubles with frontend, that i probably won't fix soon.
May be i need to use `effector` to refactor some of that code there 
1. Show services at the window not in the other page
2. Yellow highlight at the dark theme is looking bad, can't see text
3. User name at the right corner should look like in shadcn/ui examples
4. Change font size selection to input
5. Font size and family resets after ctrl a
6. Maybe Plate.js editor should look like A4 sheet
7. Таблички могут убегать за края карты, не то чтобы это мешает
8. Edit template name and MAYBE service в окне темплейта и контракта на нажатие кнопки редактирования 
9. Мб корзина всех договоров и шаблонов доступная только исполителю


