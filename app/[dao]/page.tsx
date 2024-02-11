"use client";

import { useEffect, useState } from "react";
import { fetchAllProposals } from "../../utils";

export default function DAOs() {
    const [allP, setAllP] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllProposalsData();
    }, []);

    async function fetchAllProposalsData() {
        setLoading(true);
        const data: any = await fetchAllProposals();
        setAllP(data);
        setLoading(false);
    }

    function CardsDAO({
        proposalId,
        author,
        proposalsCount,
        name,
        link,
        votesForYes,
        votesForNo,
        createdAt,
        reviewCreatedAt,
    }: {
        proposalId: any;
        author: any;
        proposalsCount: any
        name: any;
        link: any;
        votesForYes: any;
        votesForNo: any;
        createdAt: any;
        reviewCreatedAt: any;
    }) {
        return (
            <div>
                <p>{proposalId}</p>
                <p>{author}</p>
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
                                proposalId={thing?.proposalId}
                                author={thing?.author}
                                proposalsCount={thing?.proposalsCount}
                                name={thing?.name}
                                link={thing?.link}
                                votesForYes={thing?.votesForYes}
                                votesForNo={thing?.votesForNo}
                                createdAt={thing?.createdAt}
                                reviewCreatedAt={thing?.reviewCreatedAt}

                            />
                        </>
                    );
                })}
            </div>
        </div>
    );
}
