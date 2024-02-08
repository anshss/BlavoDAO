// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NFT.sol";

contract DAO {
    NFT _nftContract;

    constructor() {
        _nftContract = new NFT();
    }

    struct DAOMember {
        address user;
    }

    struct Proposal {
        uint proposalId;
        uint funds;
        bool acceptance;
    }

    uint proposalId;

    mapping (uint => Proposal) idToProposal;

    function joinDao(address _user) public {}

    function leaveDao(address _user) public {}

    function createProposal(uint _amount) public {}

    function fundProposal(uint _proposalId) public {}

    function submitProposal(uint _proposalId) public {}

    function createPeerReview(uint _proposalId) public {}

    function fetchAllProposals() public view returns (Proposal[] memory) {
        uint counter = 0;

        Proposal[] memory tickets = new Proposal[](proposalId);
        for (uint i = 0; i < proposalId; i++) {
            uint currentId = i + 1;
            Proposal storage currentItem = idToProposal[currentId];
            tickets[counter] = currentItem;
            counter++;
        }
        return tickets;
    }
}