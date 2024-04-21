const express = require('express')
const {registerUser,
    loginUser,
    getAllUsers,
    getAllTypeOfBudget,
    getAllBudgetAccounts,
    createBudgetAccount,
    updateBudgetAccount,
    deleteBudgetAccount,
    getAllTypeOfExpenses,
    getAllExpenses,
    createExpenses,
} = require('../controllers/controller.js')

const route = express.Router()


route.post('/register', registerUser )

route.post('/login',loginUser)

route.get('/users', getAllUsers)

route.get('/budget/type', getAllTypeOfBudget)
route.get('/budget/list', getAllBudgetAccounts)

route.post('/budget', createBudgetAccount) /** */
route.put('/budget', updateBudgetAccount)
route.delete('/budget', deleteBudgetAccount)

route.get('/expenses/type', getAllTypeOfExpenses)
route.get('/expenses/list', getAllExpenses)

route.post('/expenses', createExpenses)







module.exports = route