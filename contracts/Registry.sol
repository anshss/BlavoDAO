//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
pragma experimental ABIEncoderV2;

import "./DAO.sol";

contract Registry {

    struct Dao{
        uint256 daoId;
        string genre;
        uint256 totalProposal;
        uint256 totalMembers;
    }

    DAO[] public contracts;
    mapping (address => uint) public userAddressToContractId;
    mapping (address => bool) public hasDeployed;
    mapping (uint256 => Dao) public Daos;
    mapping (uint256 => address) public daoIdToAddress;

    // uint256 DaoId;
    uint256 public nextDaoId = 0;

    function createDAO(string memory _genre) public {
        // require(hasDeployed[msg.sender] != true);
        DAO t = new DAO();
        contracts.push(t);
        // hasDeployed[msg.sender] = true;
        userAddressToContractId[msg.sender] = contracts.length - 1;
        nextDaoId++;
        Daos[nextDaoId] = Dao(
            nextDaoId,
            _genre,
            1,
            1
        );
        daoIdToAddress[nextDaoId] = address(t);
    }

    function updateDao(uint256 daoId) public {
        address add  =  daoIdToAddress[daoId];
        DAO t = DAO(add);
        uint256 noOfUsers =  t.getProposal();
        uint256 noOfProposal = t.getProposal();

        Daos[daoId].totalProposal = noOfProposal;
         Daos[daoId].totalMembers = noOfUsers;
        // Daos[daoId].totalMembers = noOfUsers;

    }

    function fetchAllDAO() public view returns (Dao[] memory) {
            uint counter = 0;

            Dao[] memory tickets = new Dao[](nextDaoId);
            for (uint i = 1; i <= nextDaoId; i++) {
                // uint currentId = i + 1;
                Dao storage currentItem = Daos[i];
                tickets[counter] = currentItem;
                counter++;
            }
        return tickets;
    }
}