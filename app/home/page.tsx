"use client";

import { useEffect, useState } from "react";
import { fetchAllDAOs } from "../../utils";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";

export default function Home() {
    const [allD, setAllD] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllDAOsData();
    }, []);

    async function fetchAllDAOsData() {
        setLoading(true);
        const data: any = await fetchAllDAOs();
        setAllD(data);
        setLoading(false);
    }

    function CardsDAO({
        genre,
        membersCount,
        proposalsCount,
    }: {
        genre: any;
        membersCount: any;
        proposalsCount: any;
    }) {
        return (
            <div>
                <p>{genre}</p>
                <p>{membersCount}</p>
                <p>{proposalsCount}</p>
            </div>
        );
    }

    // if (loading == true)
    // return (
    //     <div>
    //         <div>
    //             <h1>Loading..</h1>
    //         </div>
    //     </div>
    // );

    // if (loading == false && !allD?.length)
    // return (
    //     <div>
    //         <div>
    //             <h1>No DAO&apos;s Created</h1>
    //         </div>
    //     </div>
    // );

    return (
        <div>
            <NavBar />
            <div className="flex">
                <SideBar />
                <div className="text-white p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-[100%] h-[100vh]">
                    {/* <h1>All DAOs</h1> */}
                    <div className="mt-10">
                        <h1 className="font-bold text-3xl text-center">
                            Available DAOs
                        </h1>
                    </div>
                    <div>
                        {allD?.map((thing: any, i: any) => {
                            return (
                                <>
                                    <CardsDAO
                                        key={i}
                                        genre={thing?.genre}
                                        membersCount={thing?.membersCount}
                                        proposalsCount={thing?.proposalsCount}
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
