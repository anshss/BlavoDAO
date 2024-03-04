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
        bool isSubmit ;
        bool isRaise ;
        bool isPublish ;
        // uint256 reviewCreatedAt;
        uint256 publishCreatedAt;
        uint256 funds;
    }

    enum VotingOptions { Yes, No }
    enum Status { Accepted, Rejected, Pending }
}
