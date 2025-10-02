'use client';

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const TRPCDebug = () => {
    const trpc = useTRPC();
    
    const { data: agentsData, isLoading: agentsLoading, error: agentsError } = useQuery(
        trpc.agents.getMany.queryOptions({
            page: 1,
            pageSize: 10,
        })
    );

    const { data: meetingsData, isLoading: meetingsLoading, error: meetingsError } = useQuery(
        trpc.meetings.getMany.queryOptions({})
    );

    return (
        <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-bold mb-4">TRPC Debug Info</h3>
            
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold">Agents Query:</h4>
                    <p>Loading: {agentsLoading ? 'Yes' : 'No'}</p>
                    <p>Error: {agentsError ? agentsError.message : 'None'}</p>
                    <p>Data: {agentsData ? JSON.stringify(agentsData, null, 2) : 'None'}</p>
                </div>
                
                <div>
                    <h4 className="font-semibold">Meetings Query:</h4>
                    <p>Loading: {meetingsLoading ? 'Yes' : 'No'}</p>
                    <p>Error: {meetingsError ? meetingsError.message : 'None'}</p>
                    <p>Data: {meetingsData ? JSON.stringify(meetingsData, null, 2) : 'None'}</p>
                </div>
            </div>
        </div>
    );
};
