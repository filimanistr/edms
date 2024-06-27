# Система договоров с образовательными учреждениями

Позволяет сократить время и ресурсы на хранение, передачу, составление и согласование договоров за счет ведения электронного документооборота. 

Документы созданные в системе, не являются юридически значимыми, для этого необходима интеграция с ПО оператора ЭДО или регистрация себя как оператора ЭДО для получения электронной подписи, которая дает юр. значимость. Поправьте меня если я не так понял этот момент, но так и пишут везде (мир победившей бюрократии ужс).

## How to build

Копируем проект себе на машину и переходим в папку

```
git clone https://github.com/filimanistr/edms/ && cd edms
```

Собираем docker образы

```
docker compose -f docker-compose.prod.yml build
```

Запускаем контейнеры
```
docker compose -f docker-compose.prod.yml up -d
```

Запускаем миграции

```
docker compose -f docker-compose.prod.yml exec server python manage.py migrate
```

Создаем в системе исполнителя на основе данных в .env/dev

```
docker compose -f docker-compose.prod.yml exec server python manage.py initadmins
```

go to [localhost:3000](http://localhost:3000/) под почтой `admin@gmail.com` и паролем `admin`

Если деплоить это и дальше, то нужен веб сервер вне контейнера и базу с контейнера на отдельный сервер закинуть, тогда надо переписывать docker-compose.yml и не только. Сейчас оно здесь представлено в ознакомительном виде

## How to clean

Чтобы удалить все контейнеры, их образы и volumes, созданные командой выше

```
docker compose -f docker-compose.prod.yml down -v --rmi local
```

## TODO:

1. History of changes
2. Удалять все (кидать в архив), особые правила при удалении договоров: можно если обе стороны согласны
3. Исправить пагинацию с сервера
4. Главная страница с долгом
5. Веб сокеты мб чтобы статусы договоров обновлять без перезагрузки 
6. Аутентификация, рассмотреть другие варианты 
7. Тесты бы сделать
8. Documenting API
9. Docker multi staged build

По клиентской части таски 
1. Show services at the window not in the other page
2. Yellow highlight at the dark theme is looking bad, can't see text
3. Change font size selection to input
4. Font size and family resets after ctrl a
5. Maybe Plate.js editor should look like A4 sheet
6. Таблички могут убегать за края карты, не то чтобы это мешает
7. Адаптированность к мобилкам
