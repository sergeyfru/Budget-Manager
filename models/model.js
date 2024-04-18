const { db } = require("../config/data.js");
const bcrypt = require("bcrypt");


const _createUser = async (user) => {
  const { username, password, email, first_name, last_name } = user;
  const trx = await db.transaction();
  try {
    // Insert user data into the 'users' table
    const [userid] = await trx("users").insert(
      { email, username, first_name, last_name },
      ["userid"]
    );

    // Hash the password and insert it into the 'hashpwd' table
    const hashedPassword = await bcrypt.hash(password + "", 10);
    await trx("hashedpwd").insert({
      userid: userid.userid,
      password: hashedPassword,
    });

    await trx.commit();

    return userid;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

const _getUserByEmail = async (email) => {
  try {
    const user = await db("users")
      .select("hashedpwd.password", "users.userid")
      .join("hashedpwd", { "users.userid": "hashedpwd.userid" })
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
      await db("hashedpwd").where({ userid: id }).update({ password });
    }
  } catch (error) {
    throw error;
  }
}

const _createBudgetAccount = async(accName,accAmount, accType, userid) =>{
  const trx = await db.transaction();
  try {
    const [type_id] = await trx("typeOfBudget").select('typeId','typeName').where({typeName:accType})

    const newAsset = await trx('budgetAccaunt').insert({typeid:type_id.typeid, assetsName:accName, assetsAmount:accAmount,userid})

    await trx.commit();

    return newAsset;
    
  } catch (error) {
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
  _createBudgetAccount,
};
