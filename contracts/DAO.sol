// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NFT.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "./PeerReviewed.sol";

contract DAO {
    NFT _nftContract;
    IERC20 public token;

    constructor() {
        _nftContract = new NFT();
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
        uint256 reviewCreatedAt;
        uint256 publishCreatedAt;
    }

    enum VotingOptions { Yes, No }
    enum Status { Accepted, Rejected, Pending }
    enum Raise { raiseUp, raiseDown }
    enum Publish { Yes, No }
    enum Submit { Yes, No }

    uint256 proposalId;
    uint constant JOIN_DAO_MIN_SHARE = 50;
    uint256 constant VOTING_PERIOD = 7 days;
    uint public nextProposalId = 1;
    // uint256  Share;
    uint256 userId;
    uint256 public totalShares;
    address private owner;

    PeerReviewed[] public PeerArray;

    mapping (uint256 => Proposal) proposals;
    mapping (address => mapping(uint256 => bool)) public votes;
    mapping (address => uint256) public  shares;
    mapping (address => uint256) public userToUserId;
    mapping (uint256 => uint256) public proposalIdToFunds;
    mapping (address => address) public PeerAddressToContractAddress;

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

    function joinDao(uint256 _amount) public {
        //is user stakes, hold nft, has lp tokens;
        uint256 Share = (_amount/1000);
        require(JOIN_DAO_MIN_SHARE <= Share, "More funds require to join dao");
        token.transferFrom(msg.sender, address(this), _amount);
        shares[msg.sender] +=  Share;
        totalShares += Share;
        userToUserId[msg.sender] = userId;
        userId++;
    }

    function addShare(uint _amount) public {
        require(userToUserId[msg.sender] > 0,"user does not exist");
        token.transferFrom(msg.sender, address(this), _amount);
        uint256 Share = (_amount/1000);
        totalShares += Share;
        shares[msg.sender] += Share;
    }  

    function WithdrawShare(uint _amount) public {
        require(userToUserId[msg.sender] > 0, "user does not exist");
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
            Raise.raiseDown,
            Publish.No,
            0, 
            0
        );
        nextProposalId++;
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
       proposals[_proposalId].link = _link;
       proposals[_proposalId].submit = Submit.Yes;
    }


    function reviewProposal(uint256 _proposalId, VotingOptions _vote, uint256 times) public reviewModifier(_proposalId, times) { 
        Proposal storage proposal = proposals[_proposalId];
        proposal.reviewCreatedAt = block.timestamp;
        require(block.timestamp <= proposal.reviewCreatedAt + VOTING_PERIOD, "Voting period is over");
        uint256 Yes;
        uint256 No;
        votes[msg.sender][_proposalId] = true;
        if(_vote == VotingOptions.Yes) {
           Yes += times;
            if(Yes * 100 / totalShares > 50) {
                proposal.raise = Raise.raiseUp;
                createPeerReview(_proposalId);
            }
        } else {
            No += times;
            if(No * 100 / totalShares > 50) {
                proposal.raise = Raise.raiseDown;
            }
        }
    }

    function createPeerReview(uint256 _proposalId) public  {
        require(proposals[_proposalId].raise == Raise.raiseUp, "Not ready to vote");
        PeerReviewed Peer = new PeerReviewed(address(this), proposals[_proposalId].author);
        PeerArray.push(Peer);
        PeerAddressToContractAddress[msg.sender] = address(Peer);
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

            Proposal[] memory tickets = new Proposal[](proposalId);
            for (uint i = 0; i < proposalId; i++) {
                uint currentId = i + 1;
                Proposal storage currentItem = proposals[currentId];
                tickets[counter] = currentItem;
                counter++;
            }
            return tickets;
        }

    function FundProposal(uint256 _amount, uint256 _proposalId) public {
        proposalIdToFunds[_proposalId] = _amount;
        token.transferFrom(msg.sender, address(this), _amount);
    }

    function FundDao(uint _amount) external {
        token.transferFrom(msg.sender, address(this), _amount);
    }

    function withdrawAll() external  {
        uint256 amount = token.balanceOf(address(this));
        require(amount > 0, "balnace is 0");
        token.transfer(msg.sender, amount);
    }  

}
