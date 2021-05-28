pragma solidity >=0.4.22;

contract contracts {
    //Model a candidate
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    //store candidates
    //fetch candidates
    mapping(uint256 => Candidate) public candidates;

    //store candidates count
    uint256 public candidatesCount;

    //Constructor
    constructor() {
        addCandidate("Candidate1");
        addCandidate("Candidate2");
    }

    //Adding Candidates
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
}
