const btnAssets = document.getElementById('btnAssets');
const btnExpenses = document.getElementById('btnExpenses');
const logOut = document.getElementById('logOut');
const assets = document.getElementById('assets');
const previusAssets = document.getElementById('previusAssets');
const type_name = document.getElementById('type_name')
const expenses = document.getElementById('expenses');
const previusExpenses = document.getElementById('previusExpenses');
const t_exp_name = document.getElementById('t_exp_name')
const assets_form = document.forms[0]
const expenses_form = document.forms[1]
const info = document.getElementById('info')
const url = 'http://localhost:5000'

const createLists = async (url) => {
    try {
        console.log(url, 'before');
        await createListOfAssets(url + '/budget/list')
        await createListOfTypeOfBudget(url + '/budget/type')

        await createListTypeOfExpenses(url + '/expenses/type')
        await createListExpenses(url + '/expenses/list')


    } catch (err) {
        console.log(err);
    }
}

const addNewAsset = async(e) => {
    e.preventDefault();
    let type_id = assets_form.type_name.value
    let account_name = assets_form.account_name.value
    let account_amount = assets_form.account_amount.value
    console.log(type_id, account_name, account_amount);
    try {
        const newAsset = await fetch(url + '/budget', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type_id, account_name, account_amount }),
        })
        console.log('after', newAsset);

        if(newAsset.status == 200){
            info.querySelector('h4').innerHTML = 'The asset has already been created.'
            info.style.display = 'block'

        }else if(newAsset.status == 200 ){
            info.querySelector('h4').innerHTML = 'The asset was created successfully'
            info.style.display = 'block'
        }
        // const data = await JSON.parse(newAsset)
        // console.log(data);

        await createListOfAssets(url + '/budget/list')

    } catch (err) {
        console.log(err);
    };
    assets_form.type_name.value =''
    assets_form.account_name.value =''
    assets_form.account_amount.value =''
};

async function btnExpensesClicked(e) {
    e.preventDefault();
    assets.style.display = 'none'
    expenses.style.display = 'flex'
}

async function btnAssetsClicked(e) {
    e.preventDefault();
    expenses.style.display = 'none'
    assets.style.display = 'flex'
}

const close = (e) =>{
    e.preventDefault()
    info.style.display= 'none'
}

async function createListOfAssets(url) {
    console.log(typeof url, url);
    previusAssets.innerHTML =''
    try {
        let obj = await fetchFunc(url)
        if (obj.length > 0) {
            for (const i in obj) {

                previusAssets.innerHTML += `<li>
                <h4>${obj[i].account_name.toUpperCase()}</h4> ${obj[i].account_amount}
                </li>`
            }

        } else {
            previusAssets.innerHTML = `<li>
            You dont have payment methods
                </li>`
        }
    } catch (err) {
        throw Error(err)
    }

}
async function createListOfTypeOfBudget(url) {
    try {
        let obj = await fetchFunc(url)

        for (const i in obj) {
            let option = document.createElement('option')
            option.innerHTML = obj[i].type_name
            option.value = obj[i].type_id
            type_name.appendChild(option)
        }

    } catch (err) {
        throw Error(err)
    }

}
async function createListExpenses(url) {
    previusExpenses.innerHTML = ''
    try {
        let obj = await fetchFunc(url)
        if (obj.length > 0) {
            for (const i in obj) {

                previusExpenses.innerHTML += `<li>
                <h4>${obj[i].exp_name.toUpperCase()}</h4> ${obj[i].exp_amount}
                </li>`
            }

        } else {
            previusExpenses.innerHTML = `<li>You dont have previus expenses </li>`
        }
    } catch (err) {
        throw Error(err)
    }

}

async function createListTypeOfExpenses(url) {
    try {
        let obj = await fetchFunc(url)
        console.log('ih', obj);

        for (const i in obj) {
            let option = document.createElement('option')
            option.innerHTML = obj[i].t_exp_name
            option.value = obj[i].t_exp_id
            t_exp_name.appendChild(option)
        }

    } catch (err) {
        throw Error(err)
    }

}

async function fetchFunc(url) {
    try {
        const resp = await fetch(url);
        console.log('after fetch, only resp');
        const obj = await resp.json()
        return obj

    } catch (err) {
        throw Error(err)
    }

}
createLists(url)