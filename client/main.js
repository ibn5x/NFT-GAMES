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
async function renderWalletMonsters() 
    {
       $('#login_button').hide();

        //get and render properties from smart contract
        let enjimonId = 0;
        window.web3 = await Moralis.Web3.enable();
        let abi = await getAbi()
        let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
       let data = await contract.methods.getTokenDetails(enjimonId).call({from: ethereum.selectedAddress});
       console.log(data);
       renderEnjimon(0, data);
       
       $('#game').show();
    }

    function renderEnjimon(id, data) {
        let canTrain = new Date( (parseInt(data.lastMeal) + 900) * 1000);
        let deathTime = new Date( (parseInt(data.lastMeal) + parseInt(data.endurance)) * 1000);
        $('#enjimon_id').html(id);
        $('#enjimon_level').html(data.level);
        $('#enjimon_endurance').html(data.endurance);

        
        $('#enjimon_damage').html(data.damage);
        $('#enjimon_magic').html(data.magic);
        $('#enjimon_starvation').html(deathTime);
        $('#enjimon_training').html(canTrain);
        
        
    }

    function getAbi(){
        return new Promise( (res) => {

            $.getJSON("../build/contracts/Token.json",( (json) => {
                    res(json.abi);
            }))

        })
        
    }


init()

document.getElementById("login_button").onclick = login;