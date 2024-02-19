// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "./NFT.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "./PeerReviewed.sol";

contract DAO {
    NFT _nftContractForDao;
    IERC20 public token;

    constructor() {
        _nftContractForDao = new NFT("DAO MEMBER", "DM");
        token = IERC20(0x7d0A0087543B8Dd1725B907bF523a5D7103adfB8);
    }
    
    struct Proposal {
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

    // uint256 proposalId;
    uint constant JOIN_DAO_MIN_SHARE = 50;
    // uint256 constant VOTING_PERIOD = 7 days;
    uint256 constant VOTING_PERIOD = 2 minutes;
    uint256 public nextProposalId = 0;
    uint256 public userId;
    uint256 public totalShares;
    address private owner;
    uint256 peerReviewCreateAt;
    // uint256  Share;
    // uint256 Totalmembers;

    // PeerReviewed[] public PeerArray;
    function getUserId() public view returns(uint256){
        uint256 _userid = userId;
        return(_userid);
    }

    function getProposal() public view returns(uint256){
        uint256 _userid = nextProposalId;
        return(_userid);
    }

    mapping (uint256 => Proposal) public proposals;
    mapping (address => mapping(uint256 => bool)) public votes;
    mapping (address => uint256) public  shares;
    mapping (address => uint256) public userToUserId;
    mapping (uint256 => uint256) public proposalIdToFunds;
    mapping (uint256 => address) public proposalToPeerContractAddress;
    mapping (uint256 => bool) public hasPeerDeployed;

    modifier reviewModifier(uint256 _proposalId, uint256 times) {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == Status.Accepted, "Proposal is rejected");
        require(proposal.submit == Submit.Yes, "Not yet Sumbitted");
        // proposal.reviewCreatedAt = block.timestamp;
        uint256 Share = shares[msg.sender];
        require(Share >= times,"you have less votes");
        require(votes[msg.sender][_proposalId] == false, "already voted");
        // require(block.timestamp <= proposal.reviewCreatedAt + VOTING_PERIOD, "Voting period is over");
        _;
    }

    function joinDao(uint256 _amount) public payable{
        //is user stakes, hold nft, has lp tokens;
        uint256 Share = (_amount/1000);
        require(JOIN_DAO_MIN_SHARE <= Share, "More funds require to join dao");
        token.transferFrom(msg.sender, address(this), _amount);
        shares[msg.sender] +=  Share;
        totalShares += Share;
        userToUserId[msg.sender] = userId;
        userId++;
        _nftContractForDao.mint();

    }

    function addShare(uint _amount) public payable{
        // require(userToUserId[msg.sender] > 0,"user does not exist");
        token.transferFrom(msg.sender, address(this), _amount);
        uint256 Share = (_amount/1000);
        totalShares += Share;
        shares[msg.sender] += Share;
    }  

    function WithdrawShare(uint _amount) public {
        // require(userToUserId[msg.sender] > 0, "user does not exist");
        uint256 Share = (_amount/1000);
        require( Share < JOIN_DAO_MIN_SHARE, "can't withdraw funds");
        token.transfer(msg.sender, _amount);
        totalShares -= Share;
        shares[msg.sender] -= Share;
    }

    function leaveDao() external {
        uint256 Share = shares[msg.sender];
        uint256 amount = (Share*1000);
        shares[msg.sender] -= Share;
        token.transfer(msg.sender, amount);
        totalShares -= Share;
        userToUserId[msg.sender] = 0;
    }

    function transferFunds(uint amount) public {
        token.transfer(msg.sender, amount);
    }

    function recieveFunds(uint amount) public {
        token.transferFrom(msg.sender, address(this), amount);
    }

    function createProposal(string memory _name, string memory _link) public {
        nextProposalId++;
        proposals[nextProposalId] = Proposal(
            nextProposalId,
            msg.sender,
            _name,
            _link,
            0,
            0,
            block.timestamp,
            Status.Pending,
            Submit.No,
            Raise.raiseUp,
            Publish.No,
            // 0, 
            0
        );
        createPeerReview(nextProposalId);
    }

    function voteProposal(uint256 _proposalId, VotingOptions _vote, uint256 times) public {
        Proposal storage proposal = proposals[_proposalId];
        uint256 Share = shares[msg.sender];
        require(Share >= times,"you have less votes");
        require(votes[msg.sender][_proposalId] == false, "already voted");
        require(block.timestamp <= proposal.createdAt + VOTING_PERIOD, "Voting period is over");
        votes[msg.sender][_proposalId] = true;
        if(_vote == VotingOptions.Yes) {
            proposal.votesForYes += times;
            if(proposal.votesForYes * 100 / totalShares > 50) {
                proposal.status = Status.Accepted;
            }
        } else {
            proposal.votesForNo += times;
            if(proposal.votesForNo * 100 / totalShares > 50) {
                proposal.status = Status.Rejected;
            }
        }
    }

    function submitProposal(uint256 _proposalId, string memory _link) public {
        require(proposals[_proposalId].author == msg.sender, "Only author can submit");
        proposals[_proposalId].link = _link;
        proposals[_proposalId].submit = Submit.Yes;
    }


    // function reviewProposal(uint256 _proposalId, VotingOptions _vote, uint256 times) public reviewModifier(_proposalId, times) { 
    //     Proposal storage proposal = proposals[_proposalId];
    //     proposal.reviewCreatedAt = block.timestamp;
    //     require(block.timestamp <= proposal.reviewCreatedAt + VOTING_PERIOD, "Voting period is over");
    //     uint256 Yes;
    //     uint256 No;
    //     votes[msg.sender][_proposalId] = true;
    //     if(_vote == VotingOptions.Yes) {
    //        Yes += times;
    //         if(Yes * 100 / totalShares > 50) {
    //             proposal.raise = Raise.raiseUp;
    //             // createPeerReview(_proposalId);
    //         }
    //     } else {
    //         No += times;
    //         if(No * 100 / totalShares > 50) {
    //             proposal.raise = Raise.raiseDown;
    //         }
    //     }
    // }

    function createPeerReview(uint256 _proposalId) public  {
        peerReviewCreateAt = block.timestamp;
        // require(proposals[_proposalId].raise == Raise.raiseUp, "Not ready to vote");
        PeerReviewed Peer = new PeerReviewed(address(this), proposals[_proposalId].author);
        // PeerArray.push(Peer);
        proposalToPeerContractAddress[_proposalId] = address(Peer);
        hasPeerDeployed[_proposalId] = true;
    }

    // chainlink automation
    function raiseDown(uint256 _proposalId) public  {
        if(block.timestamp <= ( peerReviewCreateAt + VOTING_PERIOD)){
            proposals[_proposalId].raise = Raise.raiseDown;
        }
    }

    function publishProposal(uint256 _proposalId, VotingOptions _vote, uint256 times) public reviewModifier(_proposalId, times){
        Proposal storage proposal = proposals[_proposalId];
        proposal.publishCreatedAt = block.timestamp;
        require(block.timestamp <= proposal.publishCreatedAt + VOTING_PERIOD, "Voting period is over");
        uint256 Yes;
        uint256 No;
        votes[msg.sender][_proposalId] = true;
        if(_vote == VotingOptions.Yes) {
           Yes += times;
            if(Yes * 100 / totalShares > 50) {
                proposal.publish = Publish.Yes;
            }
        } else {
            No += times;
            if(No * 100 / totalShares > 50) {
                proposal.publish = Publish.No;
            }
        }
    }

    function fetchAllProposals() public view returns (Proposal[] memory) {
            uint counter = 0;

            Proposal[] memory tickets = new Proposal[](nextProposalId);
            for (uint i = 1; i <= nextProposalId; i++) {
                // uint currentId = i + 1;
                Proposal storage currentItem = proposals[i];
                tickets[counter] = currentItem;
                counter++;
            }
        return tickets;
    }

    // function FundProposal(uint256 _amount, uint256 _proposalId) public {
    //     proposalIdToFunds[_proposalId] = _amount;
    //     token.transferFrom(msg.sender, address(this), _amount);
    // }

    // function FundDao(uint _amount) external payable {
    //     token.transferFrom(msg.sender, address(this), _amount);
    // }

    // function withdrawAll() external payable {
    //     uint256 amount = token.balanceOf(address(this));
    //     require(amount > 0, "balnace is 0");
    //     token.transfer(msg.sender, amount);
    //     totalShares = 0;
    // }  

}
