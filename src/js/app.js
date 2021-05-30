App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasSent: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Transct.json", function(transct) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Transct = TruffleContract(transct);
      // Connect provider to interact with contract
      App.contracts.Transct.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

    // Listen for events emitted from the contract
    listenForEvents: function() {
      App.contracts.Transct.deployed().then(function(instance) {
        // Restart Chrome if you are unable to receive this event
        // This is a known issue with Metamask
        // https://github.com/MetaMask/metamask-extension/issues/2393
        instance.transactEvent({}, {
          fromBlock: 0,
          toBlock: 'latest'
        }).watch(function(error, event) {
          console.log("event triggered", event)
          // Reload when a new vote is recorded
          App.render();
        });
      });
    },

  render: function() {
    var transctInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    /*window.ethereum.enable();
    web3.eth.getAccounts(function(error, accounts){
      $("#accountAddress").html("Your Account: " + accounts[0]);
  });*/

  if(web3.currentProvider.enable){
    //For metamask
    web3.currentProvider.enable().then(function(acc){
        App.account = acc[0];
        $("#accountAddress").html("Your Account: " + App.account);
    });
} else{
    App.account = web3.eth.accounts[0];
    $("#accountAddress").html("Your Account: " + App.account);
}

    // Load contract data
    App.contracts.Transct.deployed().then(function(instance) {
      transctInstance = instance;
      return transctInstance.clientsCount();
    }).then(function(clientsCount) {
      var clientsResults = $("#clientsResults");
      clientsResults.empty();

      var clientsSelect = $('#clientsSelect');
      clientsSelect.empty();

      for (var i = 1; i <= clientsCount; i++) {
        transctInstance.clients(i).then(function(client) {
          var id = client[0];
          var name = client[1];
          var balance = client[2];

          // Render client Result
          var clientTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + balance + "</td></tr>"
          clientsResults.append(clientTemplate);

          // Render client ballot option
          var clientOption = "<option value='" + id + "' >" + name + "</ option>"
          clientsSelect.append(clientOption);
        });
      }
      return transctInstance.senders(App.account);
    }).then(function(hasSent) {
      
   
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  makeTransct: function() {
    console.log(App.account);
    var clientId = $('#clientsSelect').val();
    var amount = parseInt($('#amount').val());
    console.log(typeof amount);
    window.ethereum.enable();
    web3.eth.accounts;
    App.contracts.Transct.deployed().then(function(instance) {
      
      return instance.sift(clientId, amount, { from: App.account });
    }).then(function(result) { 
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
