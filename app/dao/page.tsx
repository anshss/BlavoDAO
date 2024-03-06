"use client";

import { useEffect, useState } from "react";
import {
    createDAO,
    fetchIfDeployed,
    fetchAllDAOs,
    fetchMyCreatedDAOId,
    fetchMyDAOs,
} from "../../utils";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import { useRouter } from "next/navigation";

export default function Dao() {
    const [loading, setLoading] = useState(false);
    const [isDeployed, setDeployed] = useState(false);
    const [formInput, setFormInput] = useState({
        genre: "test-name",
    });
    const [loaders, setLoaders] = useState({
        createDaoLoader: false,
    });
    const { push } = useRouter();

    useEffect(() => {
        fetchIfDeployedCall();
    }, []);

    async function fetchIfDeployedCall() {
        setLoading(true);
        const data = await fetchIfDeployed();
        setDeployed(data);
        setLoading(false);
    }

    async function createDAOCall() {
        setLoaders((e) => ({ ...e, createDaoLoader: true }));
        await createDAO(formInput.genre);
        await fetchIfDeployedCall();
        setLoaders((e) => ({ ...e, createDaoLoader: false }));
    }

    // if (loading == true)
    //     return (
    //         <div>
    //             <div>
    //                 <h1>Loading..</h1>
    //             </div>
    //         </div>
    //     );

    // if (loading == false && !allD?.length)
    //     return (
    //         <div>
    //             <div>
    //                 <h1>No DAO&apos;s Created</h1>
    //                 <button onClick={(e) => createDAO("philosophy")}>
    //                     Create Dao
    //                 </button>
    //             </div>
    //         </div>
    //     );

    function CreateDaoDisplay() {
        return (
            <div className="flex flex-col w-[80%] ml-[10%] mt-[15px]">
                <div className="relative w-full mb-[10px]">
                    <input
                        type="search"
                        className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                        placeholder="DAO Genre"
                        required
                        value={formInput.genre}
                        onChange={(e) => {
                            setFormInput({
                                ...formInput,
                                genre: e.target.value,
                            });
                        }}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="flex w-[40%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={createDAOCall}
                    >
                        {!loaders.createDaoLoader ? (
                            <span>Create Dao</span>
                        ) : (
                            <svg
                                aria-hidden="true"
                                role="status"
                                className="inline w-4 h-4 text-white animate-spin"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="#E5E7EB"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    function YourDaoDisplay() {
        const [myD, setMyD] = useState({
            genre: "",
            totalMembers: "",
            totalProposal: "",
            daoId: "",
        });

        useEffect(() => {
            fetchMyDao();
        }, []);

        async function fetchMyDao() {
            const data = await fetchAllDAOs();
            const daoId = await fetchMyCreatedDAOId();
            setMyD(data[daoId]);
        }

        function pushPage() {
            push(`/dao/${myD.daoId}`);
        }

        return (
            <div className="flex justify-center mt-10 w-[100%]">
                <div className="flex w-[70%] gap-5 p-6 cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    {/* <img src={imageLink} width="300px" /> */}
                    <div className="flex flex-col justify-between w-[100%]">
                        <div className="w-[100%] flex gap-[50%]">
                            <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Genre: {myD.genre}
                            </p>
                            <div className="flex mt-2 mb-2 gap-[60%]">
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                    Members: {myD.totalMembers}
                                </p>
                                {/* <p className="font-normal text-gray-700 dark:text-gray-400">
                                    Proposals: {myD.totalProposal}
                                </p> */}
                            </div>
                        </div>
                        <button
                            className=" text-center h-[50px] w-[140px] inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={pushPage}
                        >
                            <span>View Proposal</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    function JoinedDAOs() {
        const [allMyD, setAllMyD] = useState([]);

        useEffect(() => {
            fetchMyDAOsData();
        }, []);

        async function fetchMyDAOsData() {
            const data: any = await fetchMyDAOs();
            setAllMyD(data);
        }



        function CardsDAO({
            genre,
            membersCount,
            proposalsCount,
            daoId,
        }: {
            genre: any;
            membersCount: any;
            proposalsCount: any;
            daoId: any;
        }) {

            function pushPage() {
                push(`/home/${daoId}`);
            }


            return (
                <div className="flex justify-center mt-10 w-[100%]">
                    <div className="flex w-[70%] gap-5 p-6 cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        {/* <img src={imageLink} width="300px" /> */}
                        <div className="flex flex-col justify-between w-[100%]">
                            <div className="w-[100%] flex gap-[50%]">
                                <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Genre: {genre}
                                </p>
                                <div className="flex mt-2 mb-2 gap-[60%]">
                                    <p className="font-normal text-gray-700 dark:text-gray-400">
                                        Members: {membersCount}
                                    </p>
                                    {/* <p className="font-normal text-gray-700 dark:text-gray-400">
                                    Proposals: {myD.totalProposal}
                                </p> */}
                                </div>
                            </div>
                            <button
                                className=" text-center h-[50px] w-[140px] inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={pushPage}
                            >
                                <span>View Proposals</span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <>
                {allMyD?.map((thing: any, i: any) => {
                    return (
                        <>
                            <CardsDAO
                                key={i}
                                genre={thing?.genre}
                                membersCount={thing?.totalMembers}
                                proposalsCount={thing?.totalProposal}
                                daoId={thing?.daoId}
                            />
                        </>
                    );
                })}
            </>
        );
    }

    return (
        <div>
            <NavBar />
            <div className="flex">
                <SideBar />
                <div className="text-white p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-[100%] min-h-[100vh]">
                    <div className="mt-10">
                        <h1 className="font-bold text-3xl text-center">
                            Manage DAOs
                        </h1>
                    </div>
                    <div className="w-[70%]">
                        <h2 className="font-bold text-2xl text-grey">
                            Your Created DAO
                        </h2>
                    </div>
                    {isDeployed ? <YourDaoDisplay /> : <CreateDaoDisplay />}
                    <div className="w-[70%]">
                        <h2 className="font-bold text-2xl text-grey">
                            Other Joined DAOs
                        </h2>
                    </div>
                    <JoinedDAOs />
                </div>
            </div>
        </div>
    );
}
