const {
    User,
    Bank
} = require('../models/models');
const ApiError = require('../error/ApiError');



class BankController {
    async registrationUser(req, res, next) {
        const {
            email
        } = req.body;
        //условие на проверку данных и вывод ошибки
        if (!email) {
            return next(ApiError.badRequest('Некоректный email'))
        }
        //проверка существует ли пользователь или нет
        const candidate = await User.findOne({
            where: {
                email
            }
        });
        //выброс ошибки
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким E-mail уже существует'))
        }
        //хеширование пароля пользователя

        const newUser = await User.create({
            email
        });
        const userBank = await Bank.create({
            userId: newUser.id
        });


        return res.json(newUser);
    }
    async giveOrTakeMoneyById(req, res, next) {
        const {
            id,
            money,
            action
        } = req.body;

        // Условие на проверку данных и вывод ошибки
        if (!id) {
            return next(ApiError.badRequest('Некорректный id'));
        }

        // Проверка существует ли пользователь или нет
        const candidate = await User.findOne({
            where: {
                id
            }
        });

        // Выброс ошибки
        if (!candidate) {
            return next(ApiError.badRequest('Пользователь с таким ID не существует'));
        }

        try {
            // Получаем текущий баланс пользователя
            const candidateBank = await Bank.findOne({
                where: {
                    userId: id
                }
            });

            if (!candidateBank) {
                // Создаем запись в банке, если ее нет
                const newBankRecord = await Bank.create({
                    userId: id,
                    money
                });
                return res.json(newBankRecord);
            }

            // Обновляем баланс в зависимости от значения action
            let updatedMoney;

            switch (action) {
                case 'give':
                    updatedMoney = candidateBank.money + money;
                    break;
                case 'take':
                    updatedMoney = candidateBank.money - money;
                    break;
                default:
                    return next(ApiError.badRequest('Некорректное значение для действия (action)'));
            }

            // Используем метод update и дожидаемся его завершения
            await candidateBank.update({
                money: updatedMoney
            });

            // Отправляем обновленную запись в ответе
            return res.json(candidateBank);
        } catch (error) {
            // Обработка ошибок, если они произошли при обновлении
            return next(ApiError.internal('Ошибка при обновлении баланса'));
        }
    }
    async getBalance(req, res, next) {
        const {
            id
        } = req.body;

        // Условие на проверку данных и вывод ошибки
        if (!id) {
            return next(ApiError.badRequest('Некорректный id'));
        }

        // Проверка существует ли пользователь или нет
        const candidate = await User.findOne({
            where: {
                id
            }
        });

        // Выброс ошибки
        if (!candidate) {
            return next(ApiError.badRequest('Пользователь с таким ID не существует'));
        }

        try {
            // Получаем текущий баланс пользователя
            const candidateBank = await Bank.findOne({
                where: {
                    userId: id
                }
            });




            return res.json(candidateBank.money);
        } catch (error) {
            // Обработка ошибок, если они произошли при обновлении
            return next(ApiError.internal('Ошибка при обновлении баланса'));
        }
    }
    async transferMoney(req, res, next) {
        const {
            fromUserId,
            toUserId,
            amount
        } = req.body;

        // Проверка наличия необходимых данных
        if (!fromUserId || !toUserId || !amount || amount <= 0) {
            return next(ApiError.badRequest('Некорректные данные для перевода средств'));
        }

        try {
            // Проверка существования пользователей
            const fromUser = await User.findOne({
                where: {
                    id: fromUserId
                }
            });
            const toUser = await User.findOne({
                where: {
                    id: toUserId
                }
            });

            if (!fromUser || !toUser) {
                return next(ApiError.badRequest('Один из пользователей не существует'));
            }

            // Получение баланса отправителя
            const fromUserBank = await Bank.findOne({
                where: {
                    userId: fromUserId
                }
            });

            if (!fromUserBank || fromUserBank.money < amount) {
                return next(ApiError.badRequest('Недостаточно средств для перевода'));
            }

            // Обновление балансов отправителя и получателя
            const updatedFromUserMoney = fromUserBank.money - amount;
            const toUserBank = await Bank.findOne({
                where: {
                    userId: toUserId
                }
            });

            if (!toUserBank) {
                // Если у получателя нет записи в банке, создаем ее
                await Bank.create({
                    userId: toUserId,
                    money: amount
                });
            } else {
                // Обновляем баланс получателя
                await toUserBank.update({
                    money: toUserBank.money + amount
                });
            }

            // Обновляем баланс отправителя
            await fromUserBank.update({
                money: updatedFromUserMoney
            });

            // Возвращаем успешный ответ
            return res.json({
                message: `Перевод средств выполнен успешно ${amount}₽`
            });
        } catch (error) {
            // Обработка ошибок
            return next(ApiError.internal('Ошибка при выполнении перевода средств'));
        }
    }
}

module.exports = new BankController();