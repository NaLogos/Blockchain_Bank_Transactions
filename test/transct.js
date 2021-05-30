var Transct = artifacts.require("./Transct.sol");

contract("Transct", function(accounts) {
  var transctInstance;

  it("initializes with two clients", function() {
    return Transct.deployed().then(function(instance) {
      return instance.clientsCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("it initializes the clients with the correct values", function() {
    return Transct.deployed().then(function(instance) {
      transctInstance = instance;
      return transctInstance.clients(1);
    }).then(function(client) {
      assert.equal(client[0], 1, "contains the correct id");
      assert.equal(client[1], "Client 1", "contains the correct name");
      assert.equal(client[2], 1000000, "contains the correct votes count");
      return transctInstance.clients(2);
    }).then(function(client) {
      assert.equal(client[0], 2, "contains the correct id");
      assert.equal(client[1], "Client 2", "contains the correct name");
      assert.equal(client[2], 1000000, "contains the correct votes count");
    });
  });

  it("allows a client to send l9lawi", function() {
    return Transct.deployed().then(function(instance) {
      transctInstance = instance;
      clientId = 1;
      amount = 5000;
      return transctInstance.send(clientId, amount, { from: accounts[0] });
    
    }).then(function(receipt) {
        
      assert.equal(receipt.logs.length, 1, "an event was triggered");
      assert.equal(receipt.logs[0].event, "transactEvent", "the event type is correct");
      assert.equal(receipt.logs[0].args._clientId.toNumber(), clientId, "the client id is correct");
      return transctInstance.senders(accounts[0]);

    }).then(function(sift) {
      assert(sift, "the sender was marked as sifter");
      return transctInstance.clients(clientId);
    }).then(function(client) {
      var balance = client[2];
      assert.equal(balance, 1005000, "add the amount to the balance");
    })
  });
/*
  it("throws an exception for invalid candiates", function() {
    return Transct.deployed().then(function(instance) {
      transctInstance = instance;
      return transctInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return transctInstance.clients(1);
    }).then(function(client1) {
      var voteCount = client1[2];
      assert.equal(voteCount, 1, "client 1 did not receive any votes");
      return transctInstance.clients(2);
    }).then(function(client2) {
      var voteCount = client2[2];
      assert.equal(voteCount, 0, "client 2 did not receive any votes");
    });
  });

  it("throws an exception for double voting", function() {
    return Transct.deployed().then(function(instance) {
      transctInstance = instance;
      clientId = 2;
      transctInstance.vote(clientId, { from: accounts[1] });
      return transctInstance.clients(clientId);
    }).then(function(client) {
      var voteCount = client[2];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return transctInstance.vote(clientId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return transctInstance.clients(1);
    }).then(function(client1) {
      var voteCount = client1[2];
      assert.equal(voteCount, 1, "client 1 did not receive any votes");
      return transctInstance.clients(2);
    }).then(function(client2) {
      var voteCount = client2[2];
      assert.equal(voteCount, 1, "client 2 did not receive any votes");
    });
  });*/

});