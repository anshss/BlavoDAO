"use client";
import web3modal from "web3modal";
import { ethers } from "ethers";
import {
    addressRegistry,
    abiRegistry,
    abiDao,
    abiPeerReviewed,
} from "./config";
// import axios from "axios";
import { create } from "@web3-storage/w3up-client";

let allDaoProposals = [];

// Creating Instances

export async function getUserAddress() {
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });
    return accounts[0];
}

export async function getRegistryContract(providerOrSigner) {
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const contract = new ethers.Contract(
        addressRegistry,
        abiRegistry,
        provider
    );
    if (providerOrSigner == true) {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            addressRegistry,
            abiRegistry,
            signer
        );
        return contract;
    }
    return contract;
}

export async function getDAOContractAddress() {
    const address = await getUserAddress(); //fetch user address
    const contract = await getRegistryContract();
    const id = await contract.userAddressToContractId(address.toString());
    const contractAddress = await contract.contracts(id);
    return contractAddress;
}

export async function getDAOContract(providerOrSigner) {
    const contractAddress = await getDAOContractAddress();
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const contract = new ethers.Contract(contractAddress, abiDao, provider);
    if (providerOrSigner == true) {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abiDao, signer);
        return contract;
    }
    return contract;
}

export async function getDAOContractByDaoId(providerOrSigner, daoId) {
    const contractReg = await getRegistryContract();
    const contractAddress = await contractReg.daoIdToAddress(daoId);

    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const contract = new ethers.Contract(contractAddress, abiDao, provider);
    if (providerOrSigner == true) {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abiDao, signer);
        return contract;
    }
    return contract;
}

// export async function getPeerReviewedContractAddress() {
//     const address = await getUserAddress(); //fetch user address
//     const contract = await getDAOContract();
//     // const id = await contract.userAddressToContractId(address.toString());
//     const contractAddress = await contract.contracts(id);
//     return contractAddress;
// }

export async function getPeerReviewedContract(contractAddress) {
    // const contractAddress = await getPeerReviewedContractAddress();
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const contract = new ethers.Contract(
        contractAddress,
        abiPeerReviewed,
        provider
    );
    if (providerOrSigner == true) {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            contractAddress,
            abiPeerReviewed,
            signer
        );
        return contract;
    }
    return contract;
}

// Updating Registry

export async function createDAO(_genre) {
    const contract = await getRegistryContract(true);
    const tx = await contract.createDAO(_genre);
    await tx.wait();
    console.log("Created a DAO");
}

// fetching Registry

export async function fetchIfDeployed() {
    const contract = await getRegistryContract();
    const address = await getUserAddress();
    const data = await contract.hasDeployed(address.toString());
    console.log("deployed contract:", data);
    return data;
}

export async function fetchTotalDao() {
    const contract = await getRegistryContract();
    const address = await getUserAddress();
    const data = await contract.nextDaoId();
    console.log("dao id", data);
    return data;
}

export async function fetchAllDAOs() {
    const contract = await getRegistryContract();
    const data = await contract.fetchAllDAO();

    const items = await Promise.all(
        data.map(async (i) => {
            // const tokenUri = await contract.uri(i.ticketId.toString());
            // console.log(tokenUri);
            // const meta = await axios.get(tokenUri);
            // let price = ethers.utils.formatEther(i.price);
            let item = {
                daoId: i.daoId.toString(),
                genre: i.genre.toString(),
                totalProposal: i.totalProposal.toString(),
                totalMembers: i.totalMembers.toString(),
            };
            return item;
        })
    );

    console.log("Dao's Fetched ", items);
    return items;
}

export async function fetchMyCreatedDAOId() {
    const contract = await getRegistryContract();
    const userAddress = await getUserAddress();
    const data = await contract.userAddressToContractId(userAddress);
    return data;

    // const items = await Promise.all(
    //     data.map(async (i) => {
    //         let item = {
    //             daoId: i.daoId.toString(),
    //             genre: i.genre.toString(),
    //             totalProposal: i.totalProposal.toString(),
    //             totalMembers: i.totalMembers.toString(),
    //         };
    //         return item;
    //     })
    // );

    // console.log("Dao's Fetched ", items);
    // return items;
}

export async function fetchMyDAOs() {
    let myDAOs = [];

    const contract = await getRegistryContract();
    const data = await contract.fetchAllDAO();
    const userAddress = await getUserAddress();

    const items = await Promise.all(
        data.map(async (i) => {
            console.log("i", i);

            const contractDao = await getDAOContractByDaoId(
                true,
                i.daoId.toString()
            );
            const isMember = await contractDao.isMember(userAddress);
            console.log("isMember", isMember);
            if (!isMember) return;

            let subItem = {
                daoId: i.daoId.toString(),
                genre: i.genre.toString(),
                totalProposal: i.totalProposal.toString(),
                totalMembers: i.totalMembers.toString(),
            };
            myDAOs.push(...subItem);
        })
    );

    console.log("Dao's Fetched ", myDAOs);
    return myDAOs;
}

// Updating DAO

export async function joinDao(_amount) {
    const contract = await getDAOContract(true);
    const weiPrice = ethers.utils.parseUnits(_amount.toString(), "ether");
    const tx = await contract.joinDao(_amount, {
        value: weiPrice,
        gasLimit: 1000000,
    });
    await tx.wait();
    console.log("DAO Joined");
}

export async function addShare(_amount) {
    const contract = await getDAOContract(true);
    const weiPrice = ethers.utils.parseUnits(_amount.toString(), "ether");
    const tx = await contract.joinDao(_amount, {
        value: weiPrice,
        gasLimit: 1000000,
    });
    await tx.wait();
    console.log("Share Added");
}

export async function WithdrawShare(_amount) {
    const contract = await getDAOContract(true);
    const tx = await contract.WithdrawShare();
    await tx.wait();
    console.log("Withdraw Share");
}

export async function leaveDao() {
    const contract = await getDAOContract(true);
    const tx = await contract.leaveDao();
    await tx.wait();
    console.log("Leave DAO");
}

export async function createProposal(_name, _link) {
    const contract = await getDAOContract(true);
    const tx = await contract.createProposal(_name, _link);
    await tx.wait();
    console.log("Create Proposal");
}

export async function voteProposal(_proposalId, _vote, times) {
    const contract = await getDAOContract(true);
    const tx = await contract.voteProposal(_proposalId, _vote, times);
    await tx.wait();
    console.log("Vote Proposal");
}

export async function submitProposal(_proposalId, _link) {
    const contract = await getDAOContract(true);
    const tx = await contract.submitProposal(_proposalId, _link);
    await tx.wait();
    console.log("Submit Proposal");
}

export async function reviewProposal(_proposalId, _vote, times) {
    const contract = await getDAOContract(true);
    const tx = await contract.reviewProposal(_proposalId, _vote, times);
    await tx.wait();
    console.log("Review Proposal");
}

export async function publishProposal(_proposalId, _vote, times) {
    const contract = await getDAOContract(true);
    const tx = await contract.publishProposal(_proposalId, _vote, times);
    await tx.wait();
    console.log("Publish Proposal");
}

export async function FundProposal(_amount, _proposalId) {
    const contract = await getDAOContract(true);
    const weiPrice = ethers.utils.parseUnits(_amount.toString(), "ether");
    const tx = await contract.FundProposal(_amount, _proposalId, {
        value: weiPrice,
        gasLimit: 1000000,
    });
    await tx.wait();
    console.log("Funded Proposal");
}

export async function FundDao(_amount) {
    const contract = await getDAOContract(true);
    const weiPrice = ethers.utils.parseUnits(_amount.toString(), "ether");
    const tx = await contract.FundDao(_amount, {
        value: weiPrice,
        gasLimit: 1000000,
    });
    await tx.wait();
    console.log("Funded DAO");
}

// fetching DAO

export async function fetchAllProposals(daoId) {
    const contract = await getDAOContractByDaoId(true, daoId);
    const data = await contract.fetchAllProposals();

    const items = await Promise.all(
        data.map(async (i) => {
            // const tokenUri = await contract.uri(i.ticketId.toString());
            // console.log(tokenUri);
            // const meta = await axios.get(tokenUri);
            // let price = ethers.utils.formatEther(i.price);
            let item = {
                proposalId: i.proposalId.toString(),
                author: i.author.toString(),
                name: i.name.toString(),
                link: i.link.toString(),
                votesForYes: i.votesForYes.toString(),
                votesForNo: i.votesForNo.toString(),
                createdAt: i.createdAt.toString(),
                status: i.status,
                submit: i.submit,
                // reviewCreatedAt: i.reviewCreatedAt.toString(),
                // raise: i.raise.toString(),
                // publish: i.publish.toString(),
            };
            return item;
        })
    );

    console.log("Proposals Fetched: ", items);
    allDaoProposals = items;
    return items;
}

export async function fetchMyProposals() {
    let myDAOs = [];

    const contract = await getRegistryContract();
    const data = await contract.fetchAllDAO();

    await Promise.all(
        data.map(async (i) => {
            console.log("i", i);

            const contractDao = await getDAOContractByDaoId(
                true,
                i.daoId.toString()
            );
            const allProposals = await contractDao.fetchAllProposals();

            const subItems = await Promise.all(
                allProposals.map(async (i) => {
                    let item = {
                        proposalId: i.proposalId.toString(),
                        author: i.author.toString(),
                        name: i.name.toString(),
                        link: i.link.toString(),
                        votesForYes: i.votesForYes.toString(),
                        votesForNo: i.votesForNo.toString(),
                        createdAt: i.createdAt.toString(),
                        status: i.status,
                        submit: i.submit,
                    };
                    return item;
                })
            );
            myDAOs.push(...subItems);
        })
    );

    console.log("Dao's Fetched ", myDAOs);
    return myDAOs;
}

// Updating Peer Review

export async function joinPeerReview(_amount) {
    const contract = await getPeerReviewedContract(true);
    const weiPrice = ethers.utils.parseUnits(_amount.toString(), "ether");
    const tx = await contract.joinPeerReview(_amount, {
        value: weiPrice,
        gasLimit: 1000000,
    });
    await tx.wait();
    console.log("Peer Review Joined");
}

export async function submitReport(_name, _link) {
    const contract = await getPeerReviewedContract(true);
    const tx = await contract.submitReport(_name, _link);
    await tx.wait();
    console.log("Report submitted");
}

export async function acceptReport(_reviewId, _accept) {
    const contract = await getPeerReviewedContract(true);
    const tx = await contract.acceptReport(_reviewId, _accept);
    await tx.wait();
    console.log("Report Accepted");
}

export async function claimFunds(_reviewId) {
    const contract = await getPeerReviewedContract(true);
    const tx = await contract.claimFunds(_reviewId);
    await tx.wait();
    console.log("Funds Claimed");
}

export async function fetchPeerFromProposalId(proposalId) {
    const contract = await getDAOContractByDaoId(
        true,
        daoId.toString()
    );
    
    const PeerCAddress = await contract.proposalToPeerContractAddress(proposalId);
    const contractPeer = await getPeerReviewedContract(PeerCAddress)
    const data = contractPeer.fetchAllProposals()


    const items = await Promise.all(
        data.map(async (i) => {

            let item = {
                reviewId: i.reviewId.toString(),
                reviewAuthor: i.reviewAuthor.toString(),
                name: i.name.toString(),
                link: i.link.toString(),
                votesForYes: i.votesForYes.toString(),
                votesForNo: i.votesForNo.toString(),
                createdAt: i.createdAt.toString(),
                votesForNo: i.votesForNo.toString(),
                status: i.status.toString(),
                accept: i.accept.toString(),
            };
            return item;
        })
    );

    console.log("Peer reports for this solution: ", items)

    return items

}

export async function fetchAllPeerReviewSolutionsForDAOId(daoId) {
    const contract = await getDAOContractByDaoId(
        true,
        daoId.toString()
    );
    const data = await contract.fetchAllProposals();

    const items = await Promise.all(
        data.map(async (i) => {

            const PeerCAddress = await contract.proposalToPeerContractAddress(i);
            const contractPeer = await getPeerReviewedContract(PeerCAddress)
            const data = contractPeer.fetchAllProposals()


            let item = {
                reviewId: i.reviewId.toString(),
                reviewAuthor: i.reviewAuthor.toString(),
                name: i.name.toString(),
                link: i.link.toString(),
                votesForYes: i.votesForYes.toString(),
                votesForNo: i.votesForNo.toString(),
                createdAt: i.createdAt.toString(),
                votesForNo: i.votesForNo.toString(),
                status: i.status.toString(),
                accept: i.accept.toString(),
            };
            return item;
        })
    );

    console.log("Proposals Fetched");
    return items;
}

export async function fetchAllPeerRev() {
    let allPeerRev = [];

    const contract = await getRegistryContract();
    const data = await contract.fetchAllDAO();

    await Promise.all(
        data.map(async (i) => {
            console.log("i", i);

            const data = await fetchAllPeerReviewSolutionsForDAOId(i)


            allPeerRev.push();
        })
    );

    console.log("All Peer Revs ", allPeerRev);
    return allPeerRev;
}

// web3storage

async function makeStorageClient() {
    const client = await create();
    const space = await client.createSpace("iks");
    const myAccount = await client.login("anshsaxena4190@gmail.com");
    console.log(space);
    await myAccount.provision(space.did());
    await space.createRecovery(myAccount.did());
    await space.save();
    await client.setCurrentSpace(space.did());

    return client;
}

export const uploadToIPFS = async (files) => {
    const client = await makeStorageClient();
    const directoryCid = await client.uploadDirectory(files);
    return directoryCid;
};
