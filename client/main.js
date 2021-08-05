Moralis.initialize("Io42YM9atPkPahd1pfkU4aclVzupfetDimHaXB2OD"); // Application id from moralis.io
Moralis.serverURL = "https://ktg0yprtbe91.usemoralis.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0xDcc97c2d51a2D47210f3Cd47CB0F71D0fdf42F51";

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
        let now = new Date();
        $('#enjimon_id').html(id);
        $('#enjimon_level').html(data.level);
        $('#enjimon_endurance').html(data.endurance); //health
        $('#enjimon_damage').html(data.damage);
        $('#enjimon_magic').html(data.magic);
        $('#feedBtn').attr("data-enjimon-id", id);

        if(now > deathTime){
            deathTime = "<b>DEAD</b>"
        }
        $('#enjimon_starvation').html(deathTime);
        
        if(now > canTrain){
           // canTrain = "<b>Training Available</b>"
           canTrain = $('#trainBtn').show();
           $('#trainBtn').attr("data-enjimon-id", id);
        }
        $('#enjimon_training').html(canTrain);
        
    }

    function getAbi(){
        return new Promise( (res) => {

            $.getJSON("../build/contracts/Token.json",( (json) => {
                    res(json.abi);
            }))

        })
        
    }
    
    //contract functions
    async function feed(enjimonId){
        let abi = await getAbi();
        let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

        contract.methods.feed(enjimonId).send({from: ethereum.selectedAddress}).on("receipt", ( () => {
            console.log("Done!");

            renderWalletMonsters();
        }))
    }

    async function train(enjimonId){
        let abi = await getAbi();
        let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

        contract.methods.train(enjimonId).send({from: ethereum.selectedAddress}).on("receipt", ( () => {
            console.log("Done Training!");

            renderWalletMonsters();
        }))
    }

    $('#feedBtn').click(()=>{
        let enjimonId = $('#feedBtn').attr("data-enjimon-id");
        
        feed(enjimonId);
    })

    $('#trainBtn').click(()=>{
        let enjimonId = $('#trainBtn').attr("data-enjimon-id");
        
        train(enjimonId);
    })


init()

document.getElementById("login_button").onclick = login;