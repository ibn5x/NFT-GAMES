Moralis.initialize("Io42YM9atPkPahd1pfkU4aclVzupfetDimHaXB2OD"); // Application id from moralis.io
Moralis.serverURL = "https://ktg0yprtbe91.usemoralis.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0x01BA8795eCAb15F4b0a68D6c85AaA35f682cb8Dd";

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
       $("#enjimon_row").html(""); //empty this element every time we render game -prevents rerender

        //get and render properties from smart contract
        //let enjimonId = 0; //testing
        window.web3 = await Moralis.Web3.enable();
        let abi = await getAbi()
        let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        let array = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress});
        if(array.length == 0) return;
        array.forEach( async (enjimonId) => {
            let details = await contract.methods.getTokenDetails(enjimonId).call({from: ethereum.selectedAddress});
            renderEnjimon(enjimonId, details);
        });
       $('#game').show();
    }

    function renderEnjimon(id, data) {
        let canTrain = new Date( (parseInt(data.lastTrained) + 900) * 1000);
        let deathTime = new Date( (parseInt(data.lastMeal) + parseInt(data.endurance)) * 1000);
        let now = new Date();
        let imgs = ["./nicedog.gif", "./jazzy.gif","./nicedog.gif"];
        
        //vital function calc logic
        if(now > deathTime){
            deathTime = "<b>DEAD</b>"
        }
        
        
     

        let htmlString = `
        <div class="col-md-4 card sm" style="width: 15rem;" id="enjimon_${id}">
            <h4 class="card-title text-muted">Enjimon</h4>

                <img class="card-img-top enjimon_img" src="./nicedog.gif" alt="Enjimon Image"></img>
                
            <h6 class="card-subtitle mb-2 text-muted enjimon_name"><span class="enjimon_name">${data.enjimonName}</span></h6>
            <div class="car-body">
                <div>Enjimon Id: <span class="enjimon_id">${id}</span></div>
                <div>Level: <span class="enjimon_level">${data.level}</span></div>
                <div>Health: <span class="enjimon_endurance">${data.endurance}</span></div>
                <div>Attack: <span class="enjimon_damage">${data.damage}</span></div>
                <div>Magic: <span class="enjimon_magic">${data.magic}</span></div>
                <div><b>Time to Starvation:</b> <span class="enjimon_starvation">${deathTime}</span></div>
                <div><b>Enjimon Training:</b><span class="enjimon_training">${canTrain}</span></div>

                <button data-enjimon-id="${id}" class="feedBtn btn btn-primary btn-block" style="margin-top: 8px;">Feed</button>
                <button data-enjimon-id="${id}" class="trainBtn btn btn-secondary btn-block" style="margin-top: 5px;">Train</button>
            </div>
        </div>
        `;

    let element = $.parseHTML(htmlString);   
        
    $("#enjimon_row").append(element); 

    $(`#enjimon_${id} .feedBtn`).click(()=>{
        feed(id);
    });
    //train button on click
    $(`#enjimon_${id} .trainBtn`).click(()=>{
        train(id);
    });

   
     
    }

    function getAbi(){
        return new Promise( (res) => {

            $.getJSON("Token.json",( (json) => {
                    res(json.abi);
            }))

        })
        
    }
    
    //contract functions
    async function feed(enjimonId){
        let abi = await getAbi();
        let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

        contract.methods.feed(enjimonId).send({from: ethereum.selectedAddress}).on("receipt", ( () => {
            console.log("Done! " + enjimonId.enjimonName + " has been fed.");

            renderWalletMonsters();
        }))
    }

    async function train(enjimonId){
        let abi = await getAbi();
        let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

        contract.methods.train(enjimonId).send({from: ethereum.selectedAddress}).on("receipt", ( () => {
            console.log("Great Job!! " + enjimonId.enjimonName + " is tired, train again later.");

            renderWalletMonsters();
        }))
    }


init()

//document.getElementById("login_button").onclick = login;