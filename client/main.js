Moralis.initialize("Io42YM9atPkPahd1pfkU4aclVzupfetDimHaXB2OD"); // Application id from moralis.io
Moralis.serverURL = "https://ktg0yprtbe91.usemoralis.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0xFCdAcf63e7B5afBc5342321df417341387F4e956";

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
       $('#login_button').hide();

        //get and render properties from smart contract
        let enjimonId = 0;
        window.web3 = await Moralis.Web3.enable();
        let abi = await getAbi();

        let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        $('#game').show();
    }

    function getAbi(){
        return new Promise( (res) => {

            $.getJSON("Token.json",( (json) => {
                    res(json.abi);
            }))

        })
        
    }


init()

document.getElementById("login_button").onclick = login;