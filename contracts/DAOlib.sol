//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library Proposal{

    struct proposal {
        uint256 proposalId;
        address author;
        string name;
        string link;
        uint256 votesForYes;
        uint256 votesForNo;
        uint256 createdAt;
        Status status;
        Submit submit;
        Raise raise;
        Publish publish;
        // uint256 reviewCreatedAt;
        uint256 publishCreatedAt;
    }

    enum VotingOptions { Yes, No }
    enum Status { Accepted, Rejected, Pending }
    enum Raise { raiseUp, raiseDown }
    enum Publish { Yes, No }
    enum Submit { Yes, No }

}