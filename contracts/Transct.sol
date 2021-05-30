pragma solidity >=0.4.22;

contract Transct {
    // Model a Client
    struct Client {
        uint256 id;
        string name;
        uint256 balance;
    }

    // Store accounts that have made a transaction
    mapping(address => bool) public senders;
    // Store Candidates*/

    // Fetch Clients
    mapping(uint256 => Client) public clients;
    // Store Candidates Count
    uint256 public clientsCount;

    // transaction event
    event transactEvent(uint256 indexed _clientId);

    constructor() {
        addClient("Client 1");
        addClient("Client 2");
    }

    function addClient(string memory _name) private {
        clientsCount++;
        clients[clientsCount] = Client(clientsCount, _name, 1000000);
    }

    function sift(uint256 _clientId, uint256 amount) public {
        // require a valid candidate
        require(_clientId > 0 && _clientId <= clientsCount);

        // record that voter has voted
        senders[msg.sender] = true;

        // update candidate vote Count
        clients[_clientId].balance = clients[_clientId].balance + amount;

        // trigger voted event
        emit transactEvent(_clientId);
    }
}
