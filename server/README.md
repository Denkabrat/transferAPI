Запуск кода - 

1 - установка зависимостей npm install
2 - должен быть запущен postgreSQL c локальным сервером
И такими настройками: 
    PORT=4000
    DB_NAME=abramov
    DB_USER=postgres
    DB_PASSWORD=root
    DB_HOST=localhost
    DB_PORT=5432
3 - запуск проекта npm start
4 - выполнять запросы в postman или др программе по пути: http://localhost:4000/api/money/registartion



Тело запроса передается всегда ввиде строки !



1 Регистрация пользователя ввести только email по запросу /registration

пример: 
{
    "email":"test@gmail.com"
}

2 Получение денег пользователя ввести только id по запросу /getBalance

пример: 
{
    "id":1
}

3 Выдать и списать деньги пользователя ввести id пользователя, money - сумма и action - выдать или списать по запросу /giveOrTakeMoneyById

пример: 
{
    "id":1,
    "money":200,
    "action":"give"
}

4 Перевод средств: ввести fromUserId - от кого , toUserId - кому, amount - сколько денег /transferMoney

пример: 
{
    "fromUserId":1,
    "toUserId":2,
    "amount":"200"
}
