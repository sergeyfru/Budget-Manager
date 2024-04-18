const bcrypt = require("bcrypt");
const { _createBudgetAccount, _createUser, _getUserByEmail, _getAllUsers, _getUserById, _updateUserById, } = require("../models/model.js");


const registerUser = async (req, res) => {
    const { password, email, username, first_name, last_name } = req.body;

    const user = {
        username,
        password,
        email: email.toLowerCase(),
        first_name,
        last_name,
    };

    try {
        const userid = await _createUser(user);
        res.status(201).json({ message: "User registered successfully" }, userid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
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

    // let userId = req.userid 
    
    // console.log(req.userid);

    const { name, amount, typeOfBudget} = req.body;
    try {
        await _createBudgetAccount( name, amount, typeOfBudget, userId=2 )
        res.json({ message: "asset was added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

};


module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    updateUserById,
    createBudgetAccount,
};
