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
const apdateAssetForm = document.forms[2]
const deleteAssetForm = document.forms[3]
const info = document.getElementById('info')
const update_as = document.getElementById('update_as')
const delete_as = document.getElementById('delete_as')
const how_to_pay = document.getElementById('how_to_pay')
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

const addNewAsset = async (e) => {
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

        if (newAsset.status == 200) {
            info.querySelector('h2').innerHTML = 'The asset has already been created.';
            info.style.display = 'block'

        } else if (newAsset.status == 201) {
            info.querySelector('h2').innerHTML = 'The asset was created successfully'
            info.style.display = 'block'
        }
        // const data = await JSON.parse(newAsset)
        // console.log(data);

        await createListOfAssets(url + '/budget/list')
        assets_form.type_name.value = ''
        assets_form.account_name.value = ''
        assets_form.account_amount.value = ''
    } catch (err) {
        console.log(err);
    };

};

const addNewExpense = async (e) => {
    e.preventDefault()
    let t_exp_id = expenses_form.t_exp_name.value
    let exp_name = expenses_form.exp_name.value
    let exp_amount = expenses_form.exp_amount.value
    let account_id = expenses_form.account_name.value
    try {
        const resp = await fetch(url + '/expenses', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ t_exp_id, exp_name, exp_amount, account_id }),
        })
        console.log('after', resp);

        if (resp.status == 200) {
            console.log(resp);
            info.querySelector('h2').innerHTML = 'You dont have enought money here'
            info.style.display = 'block'

        } else if (resp.status == 201) {
            info.querySelector('h2').innerHTML = 'The expenses was created successfully'
            info.style.display = 'block'
        }
        // const data = await JSON.parse(newAsset)
        // console.log(data);

        await createListExpenses(url + '/expenses/list')
        await createListOfAssets(url + '/budget/list')


        expenses_form.t_exp_name.value = ''
        expenses_form.exp_name.value = ''
        expenses_form.exp_amount.value = ''
        expenses_form.account_name.value = ''
    } catch (err) {
        console.log(err);
    };

}

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

function close_div(e) {
    e.preventDefault()
    console.log('hiii');
    update_as.style.display = 'none'
    delete_as.style.display = 'none'
    info.style.display = 'none'
}

async function createListOfAssets(url) {
    console.log(typeof url, url);
    previusAssets.innerHTML = ''
    try {
        let obj = await fetchFunc(url)
        if (obj.length > 0) {
            for (const i in obj) {
                let option = document.createElement('option')
                option.innerHTML = obj[i].account_name
                option.value = obj[i].account_id
                how_to_pay.appendChild(option)

                previusAssets.innerHTML += `<li>
                <div><h4>${obj[i].account_name.toUpperCase()}</h4> ${obj[i].account_amount}</div> </li>`
            }

        } else {
            previusAssets.innerHTML = `<li>
            You dont have payment methods
                </li>`
        }
    } catch (err) {
        console.log(err);
    }

}
async function createListOfAssetsForUpdOrDel(url) {
    const card_name = document.getElementById('card_name')
    const card_name_del = document.getElementById('card_name_del')
    card_name.innerHTML =''
    card_name_del.innerHTML =''
    try {
        let obj = await fetchFunc(url)
        if (obj.length > 0) {
            for (const i in obj) {
                let option = document.createElement('option')
                option.innerHTML = obj[i].account_name
                option.value = obj[i].account_id
                let option_del = document.createElement('option')
                option_del.innerHTML = obj[i].account_name
                option_del.value = obj[i].account_id
                
                card_name.appendChild(option)
                card_name_del.appendChild(option_del)
            }

        } else {
            previusAssets.innerHTML = `<li>
            You dont have payment methods
                </li>`
        }
    } catch (err) {
        console.log(err);
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
                <div><h4>${obj[i].exp_name.toUpperCase()}</h4> ${obj[i].exp_amount}</div>
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

const deleteAsset = async(e) => {

    console.log('hi');
    e.preventDefault()

    await createListOfAssetsForUpdOrDel(url + '/budget/list')
    delete_as.style.display = 'flex'
    info.style.display = 'none'
}

const updateAsset = async(e) => {
    e.preventDefault()

    await createListOfAssetsForUpdOrDel(url + '/budget/list')
    update_as.style.display = 'flex'
    info.style.display = 'none'
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
async function fetchFuncPost(url,body) {
    try {
        const resp = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        console.log('after fetch, only resp');
        const obj = await resp.json()
        return obj

    } catch (err) {
        throw Error(err)
    }

}
async function fetchFuncPUT(url,body) {
    try {
        const resp = await fetch(url,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        console.log('after fetch, only resp');
        const obj = await resp.json()
        return obj

    } catch (err) {
        throw Error(err)
    }

}
async function fetchFuncDELETE(url,body) {
    try {
        const resp = await fetch(url,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        console.log('after fetch, only resp');
        const obj = await resp.json()
        return obj

    } catch (err) {
        throw Error(err)
    }

}

async function updateAssetSubmited(e){
    e.preventDefault()
    const account_id = apdateAssetForm.account_id.value
    const account_name = apdateAssetForm.account_name.value
    const account_amount = apdateAssetForm.account_amount.value
    console.log('account_id, account_name, account_amount',typeof account_id,typeof account_name,typeof account_amount,account_id, account_name, account_amount);
    try{
        const resp = await fetchFuncPUT(url + '/budget', {account_id, account_name, account_amount})

        console.log('resp or obj',resp);
        
        await createListOfAssets(url + '/budget/list')
        await createListOfAssetsForUpdOrDel(url + '/budget/list')
        apdateAssetForm.account_id.value = ''
        apdateAssetForm.account_name.value = ''
        apdateAssetForm.account_amount.value = ''
    }catch(err){
        console.log(err);
    }

}
async function deleteAseetSubmited(e){
    e.preventDefault()
    const account_id = deleteAssetForm.account_id.value
    // console.log('account_id, account_name, account_amount',typeof account_id,typeof account_name,typeof account_amount,account_id, account_name, account_amount);
    try{
        const resp = await fetchFuncDELETE(url + '/budget', {account_id})

        console.log('resp or obj',resp);
        
        await createListOfAssets(url + '/budget/list')
        await createListOfAssetsForUpdOrDel(url + '/budget/list')
        deleteAssetForm.account_id.value = ''
    }catch(err){
        console.log(err);
    }

}

const log_Out = async(e) =>{
    e.preventDefault()
    try {
        let obj = await fetchFunc(url + '/logout')
        
    } catch (err) {
        console.log(err);
    }
}


createLists(url)