"use client";

import { useEffect, useState } from "react";
import { fetchPeerFromProposalId, voteProposal } from "../../../utils";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Home() {
    const [allPR, setAllPeerReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaders, setLoaders] = useState({
        publishLoader: false,
    });
    const { push } = useRouter();

    const pathName = usePathname();
    let proposalId = pathName?.split("/")[2];
    console.log("proposal id", proposalId);

    useEffect(() => {
        fetchMyProposalsData();
    }, []);

    async function fetchMyProposalsData() {
        setLoading(true);
        const data: any = await fetchPeerFromProposalId(proposalId);
        setAllPeerReports(data);
        setLoading(false);
    }

    function CardsDAO({
        proposalId,
        author,
        name,
        link,
        votesForYes,
        votesForNo,
        createdAt,
    }: {
        proposalId: any;
        author: any;
        name: any;
        link: any;
        votesForYes: any;
        votesForNo: any;
        createdAt: any;
    }) {
        function pushPage() {
            push(`/home/${proposalId}`);
        }

        async function voteYesCall() {
            await voteProposal(proposalId, "Yes", 1);
        }

        async function voteNoCall() {
            await voteProposal(proposalId, "No", 1);
        }

        return (
            <div className="flex justify-center mt-10 w-[100%]">
                <div className="flex w-[70%] gap-5 p-6 cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    {/* <img src={imageLink} width="300px" /> */}
                    <div className="flex flex-col justify-between">
                        <div className="w-[100%]">
                            <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                author: {author}
                            </p>
                            <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                                name: {name}
                            </p>
                            <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                                link: {link}
                            </p>
                            {/* <div>
                                <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                                    yes votes: {votesForYes}
                                </p>
                                <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                                    no votes: {votesForNo}
                                </p>
                            </div> */}
                            <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                                createdAt: {createdAt}
                            </p>
                        </div>

                        <div className="flex gap-[4%]">
                            <button
                                className=" text-center h-[50px] w-[140px] inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={voteYesCall}
                            >
                                <span>Yes</span>
                            </button>

                            <div className="inline">
                                <button
                                    className=" text-center h-[50px] w-[140px] inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={voteNoCall}
                                >
                                    <span>No</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading == false && allPR.length == 0) {
        return(
            <div>
            <NavBar />
            <div className="flex">
                <SideBar />
                <div className="text-white p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-[100%] min-h-[100vh]">
                    {/* <h1>All DAOs</h1> */}
                    <div className="mt-10">
                        <h1 className="font-bold text-3xl text-center">
                            Peer Reports
                        </h1>
                    </div>
                    <div>
                        <h1>No Peer Reports submitted yet</h1>
                    </div>
                </div>
            </div>
        </div>
        )
    }

    return (
        <div>
            <NavBar />
            <div className="flex">
                <SideBar />
                <div className="text-white p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-[100%] min-h-[100vh]">
                    {/* <h1>All DAOs</h1> */}
                    <div className="mt-10">
                        <h1 className="font-bold text-3xl text-center">
                            Peer Reports
                        </h1>
                    </div>
                    <div>
                        {allPR?.map((thing: any, i: any) => {
                            return (
                                <>
                                    <CardsDAO
                                        key={i}
                                        proposalId={thing?.proposalId}
                                        author={thing?.author}
                                        name={thing?.name}
                                        link={thing?.link}
                                        votesForYes={thing?.votesForYes}
                                        votesForNo={thing?.votesForNo}
                                        createdAt={thing?.createdAt}
                                    />
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
