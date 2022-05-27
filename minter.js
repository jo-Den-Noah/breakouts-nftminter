let currentAccount = null;
let web3;
let abi;
let contractAddress;

$.getJSON("contract.json", function (result) {
     contractAddress = result.bonftcontact;
     abi = result.abi;
    console.log(contractAddress);
    $("#contractAddress").text(contractAddress);
  });

  function handleAccountsChanged(accounts) {
  
    if (accounts.length == 0) {
      console.log("Please connect to MetaMask.");
      $("#connect").html("Connect with Metamask");
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      var result = currentAccount.substr( 28 );
      $("#connect").html(`...  ${result}`);
      $("#status").html("");
  
      if (currentAccount != null) {
  
        $("#connect").html(currentAccount);
        try {
          web3 = new Web3(ethereum);
        } catch (error) {
          alert(error);
        }
      }
    }
    console.log("WalletAddress in HandleAccountChanged =" + currentAccount);
   doReload
  }

  function connect() {
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then(handleAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else {
          console.error(err);
        }
      });
      window.ethereum.request({method: "wallet_addEthereumChain",
      params: [{
          chainId: "0x89",
          rpcUrls: ["https://rpc-mainnet.matic.network/"],
          chainName: "Matic Mainnet",
          nativeCurrency: {
              name: "MATIC",
              symbol: "MATIC",
              decimals: 18
          },
          blockExplorerUrls: ["https://polygonscan.com/"]
      }]
    })
  }
  function detectMetaMask() {
    if (typeof window.ethereum !== "undefined") {
      return true;
    } else {
      return false;
    }
  }
  
  function mint() { 
      //$("#mint").prop("disabled", true);
    var pass = document.getElementById("pass").value;
    var pass = Number(pass);
    console.log(pass);
    const contract = new web3.eth.Contract(abi, contractAddress);
   
    try {
      web3 = new Web3(ethereum);
    } catch (error) {
      alert(error);
    }
    return new Promise((resolve,reject)=>{
     contract.methods
      .mintNFT(pass)
    .send({from:currentAccount,value:100000000000000000})
      .then((receipt) => {
        console.log(receipt);
        resolve();
      })
      .catch((err) => reject(err));
    });
  }
  function burn(){
    var tokenId = document.getElementById("burntoken").value;
    var tokenId = Number(tokenId);
    console.log(tokenId);
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        web3 = new Web3(ethereum);
      } catch (error) {
        alert(error);
      }
      return new Promise((resolve,reject)=>{
       contract.methods
        .burnNFT(tokenId)
        .send({from:currentAccount})
        .then((receipt) => {
          console.log(receipt);
          resolve();
        })
        .catch((err) => reject(err));
      });

  }
  

  $(document).ready(function () {
    m = detectMetaMask();
    if (m) {
      $("#connect").attr("disabled", false);
      connect();
    } else {
      /*$("#metaicon").addClass("meta-gray")*/;
    }
    $("#burn").click(function () {
        burn();
      });

   $("#connect").click(function () {
      connect();
    });
  
    $("#mint").click(function () {
      mint();
    });
  
  });