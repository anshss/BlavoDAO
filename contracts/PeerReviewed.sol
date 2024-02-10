// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NFT.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

interface IDao {
    function transferFunds(uint amount) external ;
    function recieveFunds(uint amount) external ;
}

contract PeerReviewed {
    NFT _nftContract;
    IERC20 public token;
    IDao dao;
    address proposalAuthor;

    constructor(address daoAddress, address _proposalAuthor) {
        _nftContract = new NFT();
        token = IERC20(0x7d0A0087543B8Dd1725B907bF523a5D7103adfB8);
        dao = IDao(daoAddress);
        proposalAuthor = _proposalAuthor;
    }

    modifier onlyproposalAuthor(){
        require(msg.sender ==proposalAuthor);
        _;
    }

    struct PeerReview{
        uint256 reviewId;
        address reviewAuthor;
        string name;
        string link;
        uint256 votesForYes;
        uint256 votesForNo;
        uint256 createdAt;
        Status status;
        Accept accept;
    }

    enum Status { Accepted, Rejected, Pending }
    enum Accept { Yes, No }


    uint256 constant JOIN_PEER_REVIEW_MIN_SHARE = 25 * 10 ** 18;
    uint256 constant VOTING_PERIOD = 15 days;
    // uint256 public totalShares;
    uint256 public nextPeerReviewId = 1;
    uint256 userId;

    mapping (uint256 => PeerReview) peerReviews;
    mapping (address => uint256) public userToUserId;
    mapping (address => uint256) public shares;


    function joinPeerReview(uint256 _amount) public {
        // uint256 Share = (_amount/1000);
        require(JOIN_PEER_REVIEW_MIN_SHARE <= _amount, "More funds require to join dao");
        dao.recieveFunds(_amount);
        shares[msg.sender] +=  _amount;
        // totalShares += Share;
        userToUserId[msg.sender] = userId;
        userId++;
    }

    function submitReport(string memory _name, string memory _link) public {
        peerReviews[nextPeerReviewId] = PeerReview(
            nextPeerReviewId,
            msg.sender,
            _name,
            _link,
            0,
            0,
            block.timestamp,
            Status.Pending,
            Accept.No
        );
        nextPeerReviewId++;
    }

    function acceptReport(uint256 _reviewId, Accept _accept) public onlyproposalAuthor {
        PeerReview storage peerReview = peerReviews[_reviewId];
        peerReview.accept = _accept;
        if(Accept.Yes == _accept){
            peerReview.status = Status.Accepted;
        } else {
            peerReview.status = Status.Rejected;
        }
    }

    function claimFunds(uint256 _reviewId) public {
        require(userToUserId[msg.sender] > 0, "Not the member");
        require(block.timestamp <= peerReviews[_reviewId].createdAt + VOTING_PERIOD, "Voting period is over");
        uint256 amount = shares[msg.sender];
        require(amount> 0, "Amount is Zero");
        amount += ((amount*5)/100);
        dao.transferFunds(amount);
        userToUserId[msg.sender] = 0;
    }
}
