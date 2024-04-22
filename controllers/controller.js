const bcrypt = require("bcrypt");

const session = require('express-session');

const {
    _getAllTypeOfBudget,
    _getAllBudgetAccounts,
    _createBudgetAccount,
    _updateBudgetAccount,
    _createUser,
    _getUserByEmail,
    _getAllUsers,
    _getUserById,
    _updateUserById,
    _deleteBudgetAccount,
    _getAllExpenses,
    _getAllTypeOfExpenses,
    _createExpenses,
} = require("../models/model.js");
const { json } = require("express");


const registerUser = async (req, res) => {
    const { password, email, username, first_name, last_name } = req.body;
    console.log('controler 1');
    const user = {
        username,
        password,
        email: email.toLowerCase(),
        first_name,
        last_name,
    };

    try {
        const userid = await _createUser(user);
        if (!userid) {
            res.status(201).json({ message: 'User already created' })
        } else {

            res.status(201).json({ message: "User registered successfully", userid });
        }
    } catch (error) {
        // console.error(error);
        res.status(500).json({ err: "Internal server error", error });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await _getUserByEmail(email.toLowerCase());

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password + "", user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Authentication failed" });
        }

        req.session.userid = user.userid;
        req.userid = user.userid;/**------------------------------------------------- HERE --------- REQ.USERID --------- */
        console.log('req.userid =>', req.userid);
        console.log('req.session.userid =>', req.session.userid);

        res.json({ message: "Login successful", userid: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getAllUsers = async (req, res) => {
    try {
        console.log(req.userid);

        const [users] = await _getAllUsers();
        console.log(users);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await _getUserById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const updateUserById = async (req, res) => {
    const userId = parseInt(req.params.id);
    // const {username, password, email, first_name, last_name} = req.body;

    let updateUser = JSON.parse(JSON.stringify(req.body));

    console.log(updateUser);

    try {
        await _updateUserById(userId, updateUser);
        res.json({ message: "User updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};/** --------------------------------------------------- WORK WITH BUDGET ACCOUNTS --------------------------------------------------- */

const getAllTypeOfBudget = async(req,res) =>{
    
    // const userId = req.userid
    // const userId = req.session.userid
    // console.log('req.userid =>', req.userid);
    // console.log('req.session.userid =>', req.session.userid);
    try{
        const typeOfBudget = await _getAllTypeOfBudget()

        res.json(typeOfBudget)
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

}
const getAllBudgetAccounts = async(req,res) =>{
    
    // const userId = req.body
    // const userId = req.userid
    // const userId = req.session.userid
    // console.log('req.userid =>', req.userid);
    // console.log('req.session.userid =>', req.session.userid);
    try{
        const typeOfBudget = await _getAllBudgetAccounts(userId = 1)

        res.json(typeOfBudget)
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

}

const createBudgetAccount = async (req, res) => {

    const { account_name, account_amount, type_id } = req.body;
    // const userId = req.userid
    // const userId = req.session.userid
    // console.log('req.userid =>', req.userid);
    // console.log('req.session.userid =>', req.session.userid);

    console.log('contr before try');
    try {
        console.log('contr try');
        console.log(account_name, account_amount, type_id);
        const newAccount = await _createBudgetAccount(account_name, account_amount, type_id, userid = 1)
        if (!newAccount) {
            res.status(200).json({ message: 'Budget Account already created' })
        } else {
            res.statu(201).json({ message: "asset was added successfully", newAccount });
        }
    } catch (error) {
        console.log('contr catch');
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

};

const updateBudgetAccount = async (req, res) => {
    const { account_id, account_name, account_amount } = req.body
    // const userId = req.userid
    // const userId = req.session.userid
    // console.log('req.userid =>', req.userid);
    // console.log('req.session.userid =>', req.session.userid);
    const { userid } = req.body


    try {
        const updatedAccount = await _updateBudgetAccount(account_id, account_name, account_amount)
        res.json(updatedAccount)

    } catch (error) {
        console.log('controller catch');
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

}

const deleteBudgetAccount = async (req, res) => {
    const { account_id } = req.body
    // const userId = req.userid
    // const userId = req.session.userid
    // console.log('req.userid =>', req.userid);
    // console.log('req.session.userid =>', req.session.userid);
    const { userid } = req.body
    try {
        const deletedAccount = await _deleteBudgetAccount(account_id)

        res.json({ message: 'Account deleted successfully', deletedAccount })
    } catch (error) {
        console.log('controller catch');
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }



}

const getAllTypeOfExpenses = async(req,res)=>{
    try{
        const typeOfBudget = await _getAllTypeOfExpenses()

        res.json(typeOfBudget)
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
const getAllExpenses = async(req,res)=>{
    // const userId = req.userid
    // const userId = req.session.userid
    // console.log('req.userid =>', req.userid);
    // console.log('req.session.userid =>', req.session.userid);

    try{
        const typeOfBudget = await _getAllExpenses(userId = 1)

        res.json(typeOfBudget)
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}



const createExpenses = async (req, res) => {
    const { t_exp_id, exp_name, exp_amount, account_id } = req.body
    // const userId = req.userid
    // const userId = req.session.userid
    // console.log('req.userid =>', req.userid);
    // console.log('req.session.userid =>', req.session.userid);
    try {

        const newExpenses = await _createExpenses(exp_amount, exp_name, t_exp_id, account_id, userid =1)

        if (newExpenses < 0) {
            res.status(200).json({ message: `You dont have enought money here. You need ${newExpenses} more` })

        } else {
            res.status(201).json(newExpenses)
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

const logOut = async(req,res) =>{
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.sendStatus(500); // Server error
        }
        // Redirect to login page after logout
        res.redirect('/login');
    });
}


module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    updateUserById,
    getAllTypeOfBudget,
    getAllBudgetAccounts,
    createBudgetAccount,
    updateBudgetAccount,
    deleteBudgetAccount,
    getAllExpenses,
    getAllTypeOfExpenses,
    createExpenses,
    logOut,
};
