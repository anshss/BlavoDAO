"use client";

import { useEffect, useState } from "react";
import { createDAO, fetchIfDeployed } from "../../utils";

export default function Home() {
    const [allD, setAllD] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDeployed, setDeployed] = useState(false);

    useEffect(() => {
        // fetchAllDAOsData();
        fetchIfDeployedCall();
    }, []);

    async function fetchIfDeployedCall() {
        setLoading(true);
        const data = await fetchIfDeployed();
        setDeployed(data);
        setLoading(false);
    }

    function CardsDAO({
        genre,
        membersCount,
        proposalsCount,
    }:
    {
        genre: any,
        membersCount: any,
        proposalsCount: any
    }) {
        return (
            <div>
                <p>{genre}</p>
                <p>{membersCount}</p>
                <p>{proposalsCount}</p>
            </div>
        );
    }

    if (loading == true)
    return (
        <div>
            <div>
                <h1>Loading..</h1>
            </div>
        </div>
    );

    if (loading == false && !allD?.length)
    return (
        <div>
            <div>
                <h1>No DAO&apos;s Created</h1>
                <button onClick={e => createDAO("philosophy")}>Create Dao</button>
            </div>
        </div>
    );

    return (
        <div className="">
            <h1>All DAOs</h1>
            <button onClick={createDAO}>Create Dao</button>
            <div> deployment status: </div>
            {isDeployed ? <p>true</p> : <p>false</p>}
        </div>
    );
}
