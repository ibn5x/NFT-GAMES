Moralis.initialize("Io42YM9atPkPahd1pfkU4aclVzupfetDimHaXB2OD"); // Application id from moralis.io
Moralis.serverURL = "https://ktg0yprtbe91.usemoralis.com:2053/server"; //Server url from moralis.io

async function login() {
    try {
        user = await Moralis.Web3.authenticate();
        console.log(user);
        alert("User logged in")
    } catch (error) {
        console.log(error);
    }
}

document.getElementById("login_button").onclick = login;