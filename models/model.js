const { db } = require("../config/data.js");
const bcrypt = require("bcrypt");


const _createUser = async (user) => {
  console.log('models 1');
  const { username, password, email, first_name, last_name } = user;
  const trx = await db.transaction();
  try {
    // Insert user data into the 'users' table
    console.log('models in try 1');
    let alreadyCreated = await trx('users').select('userid', 'username', 'email').where({ username }).first()
    console.log('models in try check user');
    if (alreadyCreated) {
      console.log('models in try already created');
      return 0
    }
    const [userid] = await trx("users").insert(
      { email, username, first_name, last_name },
      ["userid"]
    );
    console.log('models in try 2');

    // Hash the password and insert it into the 'hashpwd' table
    const hashedPassword = await bcrypt.hash(password + "", 10);
    await trx("hashed_pswd").insert({
      userid: userid.userid,
      password: hashedPassword,
    });

    console.log('models in try 3');
    await trx.commit();

    return userid;
  } catch (error) {
    console.log('models catch');
    console.log(error);
    await trx.rollback();
    throw error;
  }
}

const _getUserByEmail = async (email) => {
  try {
    const user = await db("users")
      .select("hashed_pswd.password", "users.userid")
      .join("hashed_pswd", { "users.userid": "hashed_pswd.userid" })
      .where({ email })
      .first();
    return user;
  } catch (error) {
    throw error;
  }
}

const _getAllUsers = async () => {
  try {
    const users = await db("users");
    return users;
  } catch (error) {
    throw error;
  }
}

const _getUserById = async (id) => {
  try {
    const user = await db("users").where({ userid: id }).first();
    return user;
  } catch (error) {
    throw error;
  }
}

const _updateUserById = async (id, updatedUser) => {
  let userpassword;
  if (updatedUser?.password) {
    userpassword = updatedUser?.password;
    delete updatedUser.password;
  }
  try {
    await db("users").where({ userid: id }).update(updatedUser);

    if (userpassword) {
      // Hash the password and insert it into the 'hashpwd' table
      const password = await bcrypt.hash(userpassword + "", 10);
      await db("hashed_pswd").where({ userid: id }).update({ password });
    }
  } catch (error) {
    throw error;
  }
}

const _getAllTypeOfBudget = async()=>{
  try {
    const type_of_budget = await db("type_of_budget").select('type_name','type_id');
    return type_of_budget;
  } catch (error) {
    throw error;
  }
}
const _getAllBudgetAccounts = async(userid)=>{
  try {
    const budget_accounts = await db("budget_account").select('account_name','account_amount').where({userid});
    return budget_accounts;
  } catch (error) {
    throw error;
  }
}

const _createBudgetAccount = async (account_name, account_amount, type_id, userid) => {
  const trx = await db.transaction();
  console.log('model refor try');
  try {
    console.log('model try 1');

    const accountAlreadyCreated = await trx('budget_account')
    .select('account_name', 'account_amount').where({ userid, account_name }).first()
    if (accountAlreadyCreated) {
      return 0
    }
    console.log('model try 2');
    
    const [newAccount] = await trx('budget_account')
    .insert({ type_id, account_name, account_amount, userid }, ['account_name', 'account_amount'])
    console.log('model try 3');

    await trx.commit();

    console.log(newAccount);
    
    return newAccount;

  } catch (error) {
    console.log('model catch');
    await trx.rollback();
    throw error;
  }
}

const _updateBudgetAccount = async (userId, account_name, old_account_name, account_amount) => {

  console.log('models before try');
  const trx = await db.transaction();
  try {

    console.log('models in try 1');

    const [account] = await trx('budget_account').select('account_id', 'account_name', 'userid')
      .where({ account_name: old_account_name, userid: userId })
    // .first()
    const account_id = account.account_id
    console.log(account_id);

    console.log('models in try 2');



    if (!account_name) {
      console.log('new amount');
      const [account] = await trx('budget_account').update({ account_amount }, ['account_id', 'userid', 'account_name', 'account_amount']).where({ account_id })

      await trx.commit();

      return account
    } else if (!account_amount) {
      console.log('new name');
      const [account] = await trx('budget_account').update({ account_name }, ['account_id', 'userid', 'account_name', 'account_amount']).where({ account_id })

      await trx.commit();

      return account
    } else {
      console.log('new name and amount');
      console.log('HI CHECK!!!', typeof account_amount, account_name);
      const [account] = await trx('budget_account')
        .update({ account_amount, account_name }, ['account_id', 'userid', 'account_name', 'account_amount'])
        .where({ account_id })
      // .returning('account_id','userid', 'account_name','account_amount')

      await trx.commit();

      return account
    }
  } catch (error) {
    console.log('model catch');
    await trx.rollback();
    throw error;
  }


}


const _deleteBudgetAccount = async (userid, account_name) => {
  const trx = await db.transaction();
  console.log('model befor try');

  try {
    console.log('model try 1');

    const [account] = await trx('budget_account').select('account_id', 'account_name', 'userid').where({ account_name, userid })

    const account_id = account.account_id

    console.log('model try 2');

    const deleted = await trx('budget_account').del().where({ account_id }).returning("*")

    await trx.commit()
    return deleted



  } catch (error) {
    console.log('model catch');
    await trx.rollback();
    throw error;
  }

}
const _getAllExpenses =async(userid)=>{
  try {
    const expenses = await db("expenses").select('exp_id','exp_name','exp_amount');
    return expenses;
  } catch (error) {
    throw error;
  }
}


const _getAllTypeOfExpenses = async () => {
  try {
    const type_of_expenses = await db("type_of_expenses").select('t_exp_name','t_exp_id');
    return type_of_expenses;
  } catch (error) {
    throw error;
  }
}



const _createExpenses = async (exp_amount, exp_name, t_exp_name, account_name, userid) => {
  const trx = await db.transaction();
  console.log('model befor try');
  try {
    console.log('model try 1');
    const fromAccount = await trx("budget_account").select('account_id', 'account_name', 'account_amount').where({ account_name }).first()

    if (fromAccount.account_amount < exp_amount) {
      console.log('not enought money');
      return fromAccount.account_amount - exp_amount
    }
    console.log(fromAccount.account_id);

    console.log('model try 2');

    const [t_exp] = await trx("type_of_expenses").select('t_exp_id', 't_exp_name').where({ t_exp_name })
    console.log(t_exp.t_exp_id);

    console.log('model try 3');

    const [newExpenses] = await trx('expenses')
      .insert({
        userid,
        t_exp_id: t_exp.t_exp_id,
        account_id: fromAccount.account_id,
        exp_name,
        exp_amount,
      }, ['userid', 'exp_name', 'exp_amount'])

    console.log('model try 4');

    const balance = fromAccount.account_amount - exp_amount
    const [accountUpdated] = await trx("budget_account").where({ account_name })
      .update({ account_amount: balance }, ['account_id', 'account_name', 'account_amount'])

    const returning = { newExpenses, accountUpdated }

    await trx.commit();

    return returning;

  } catch (error) {
    console.log('model catch');
    await trx.rollback();
    throw error;
  }
}


module.exports = {
  _createUser,
  _getUserByEmail,
  _getAllUsers,
  _getUserById,
  _updateUserById,
  _getAllTypeOfBudget,
  _getAllBudgetAccounts,
  _createBudgetAccount,
  _updateBudgetAccount,
  _deleteBudgetAccount,
  
  _getAllExpenses,
  _getAllTypeOfExpenses,
  _createExpenses,
};
