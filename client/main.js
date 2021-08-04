Moralis.initialize("Io42YM9atPkPahd1pfkU4aclVzupfetDimHaXB2OD"); // Application id from moralis.io
Moralis.serverURL = "https://ktg0yprtbe91.usemoralis.com:2053/server"; //Server url from moralis.io

async function  init()  {
    try {
            let user = await Moralis.User.current();
            if(!user)
                {
                    $('#login_button').click( async () => {
                        user = await Moralis.Web3.authenticate();
                    })       
                }
            renderWalletMonsters();
        } catch (error) {
            console.log(error);
        }
}

//Render NFTs here
function renderWalletMonsters() 
    {
        $('#game').show();
        $('#login_button').hide();
    }


init()

document.getElementById("login_button").onclick = login;