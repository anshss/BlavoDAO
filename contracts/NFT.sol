// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function mint() public {
        _mint(msg.sender, 1);
    }
}
