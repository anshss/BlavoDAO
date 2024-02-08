// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NFT.sol";

contract PeerReviewed {
    NFT _nftContract;

    constructor() {
        _nftContract = new NFT();
    }

    function joinPeerReview() public {}

    function submitReport() public {}

    function claimFunds() public {}
}