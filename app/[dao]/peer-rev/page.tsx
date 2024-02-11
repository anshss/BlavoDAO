"use client";

import { useEffect, useState } from "react";
import { fetchAllPeerRevs } from "../../../utils";

export default function PeerRev() {
    const [allP, setAllP] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllPeerRevsData();
    }, []);

    async function fetchAllPeerRevsData() {
        setLoading(true);
        const data: any = await fetchAllPeerRevs();
        setAllP(data);
        setLoading(false);
    }

    function CardsDAO({
        reviewId,
        reviewAuthor,
        name,
        link,
        votesForYes,
        votesForNo,
        createdAt,
        // status,
        // accept,

    }: {
        reviewId: any;
        reviewAuthor: any;
        name: any;
        link: any;
        votesForYes: any;
        votesForNo: any;
        createdAt: any;
        // status: any
        // accept: any;
    }) {
        return (
            <div>
                <p>{reviewId}</p>
                <p>{reviewAuthor}</p>
                <p>{name}</p>
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

    if (loading == false && !allP.length)
    return (
        <div>
            <div>
                <h1>No Proposal&apos;s Created</h1>
            </div>
        </div>
    );

    return (
        <div>
            <h1>All DAOs</h1>
            <div>
                {allP.map((thing: any, i: any) => {
                    return (
                        <>
                            <CardsDAO
                                key={i}
                                reviewId={thing?.reviewId}
                                reviewAuthor={thing?.reviewAuthor}
                                name={thing?.name}
                                link={thing?.link}
                                votesForYes={thing?.votesForYes}
                                votesForNo={thing?.votesForNo}
                                createdAt={thing?.createdAt}
                                // status={thing?.status}
                                // accept={thing?.accept}

                            />
                        </>
                    );
                })}
            </div>
        </div>
    );
}
