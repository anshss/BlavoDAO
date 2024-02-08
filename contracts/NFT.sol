// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {

    constructor() ERC721("DAOMember", "DM") {}

    function mint() public {
        _mint(msg.sender, 1);
    }
}