const bcrypt = require("bcrypt");
const { 
    _createBudgetAccount,
    _updateBudgetAccount,
    _createUser,
    _getUserByEmail,
    _getAllUsers,
    _getUserById,
    _updateUserById,
    _deleteBudgetAccount,
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
        if(!userid){
            res.status(201).json({message: 'User already created'})
        }else{

            res.status(201).json({ message: "User registered successfully", userid });
        }
    } catch (error) {
        // console.error(error);
        res.status(500).json({ err: "Internal server error" , error});
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
        
        req.userid = user.userid
        console.log(req.userid);

        res.json({ message: "Login successful", userid: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getAllUsers = async (req, res) => {
    try {
        console.log(req.userid);
        const users = await _getAllUsers();
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
};

const createBudgetAccount = async (req, res) => {

    const { account_name, account_amount, type_name} = req.body;
    const {userid} = req.body
    // const userId = req.userid
    console.log('contr before rty');
    try {
        console.log('contr try');
        const newAccount = await _createBudgetAccount( account_name, account_amount, type_name.toLowerCase(), userid )
        if(!newAccount){
            res.json({message: 'Budget Account already created'})
        }else{
            res.json({ message: "asset was added successfully" , newAccount});
        }
    } catch (error) {
        console.log('contr catch');
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

};

const  updateBudgetAccount = async(req,res) =>{
    const {account_name, old_account_name,  account_amount} = req.body
    // const userId = req.userid
    const {userid} = req.body


    try{
        const updatedAccount = await _updateBudgetAccount(userid,account_name, old_account_name,  account_amount)
        res.json(updatedAccount)

    }catch (error) {
        console.log('controller catch');
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

}

const deleteBudgetAccount = async (req,res)=>{
    const {account_name, } = req.body
    // const userId = req.userid
    const {userid} = req.body
    try{
        const deletedAccount = await _deleteBudgetAccount(userid, account_name)

        res.json({message: 'Account deleted successfully' ,deletedAccount})
    }catch (error) {
        console.log('controller catch');
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }



}






const createExpenses = async(req,res) =>{
    const {exp_amount, exp_name, t_exp_name, account_name,} = req.body
    // const userid = req.userid
    const {userid} = req.body
    try{
        console.log(userid);

        const newExpenses = await _createExpenses(exp_amount, exp_name, t_exp_name.toLowerCase(), account_name,userid)

        if(newExpenses < 0){
            res.json({message:`You dont have enought money here. You need ${newExpenses} more`})
        
        }else{
            res.json(newExpenses)
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    updateUserById,
    createBudgetAccount,
    updateBudgetAccount,
    deleteBudgetAccount,
    createExpenses,
};
