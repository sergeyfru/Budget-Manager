const express = require('express')
const {registerUser,
    loginUser,
    getAllUsers,
    createBudgetAccount,
    updateBudgetAccount,
    deleteBudgetAccount,
    createExpenses,
} = require('../controllers/controller.js')

const route = express.Router()


route.post('/register', registerUser )

route.post('/login',loginUser)

route.get('/users', getAllUsers)

route.post('/budget', createBudgetAccount)
route.put('/budget', updateBudgetAccount)
route.delete('/budget', deleteBudgetAccount)

route.post('/expenses', createExpenses)







module.exports = route