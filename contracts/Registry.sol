//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DAO.sol";

contract Registry {

    DAO[] public contracts;
    mapping (address => uint) public userAddressToContractId;
    mapping (address => bool) public hasDeployed;

    function createDAO() public {
        require(hasDeployed[msg.sender] != true);
        DAO t = new DAO();
        contracts.push(t);
    }
}