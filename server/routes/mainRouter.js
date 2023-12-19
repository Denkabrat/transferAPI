const Router = require('express');
const router = new Router();
const BankController = require('../controllers/BankController');


router.post('/registration', BankController.registrationUser);
router.put('/giveOrTakeMoneyById', BankController.giveOrTakeMoneyById);
router.get('/getBalance', BankController.getBalance);
router.post('/transferMoney', BankController.transferMoney);






module.exports = router;