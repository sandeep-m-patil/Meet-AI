"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import LoadingState from "@/components/loading-state";
import ErrorState from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialog } from "@/components/agents/new-agent-dialog";
import { AgentsFilters } from "@/components/agents/agents-filters";
import { DataTable } from "@/modules/agents/ui/components/data-table";
import { columns } from "@/modules/agents/ui/components/columns";
import { AgentGetOne } from "@/modules/agents/types";
import EmptyState from "../empty-state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const AgentsList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState<{
    search: string | null;
    isActive: boolean | null;
    tags: string | null;
  }>({
    search: null,
    isActive: null,
    tags: null,
  });

  const router = useRouter();
  const trpc = useTRPC();

  // Pagination state (0-based for TanStack)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Query: send filters + pagination
  const { data, isLoading, error } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      page: pagination.pageIndex + 1, // backend expects 1-based
      pageSize: pagination.pageSize,
      search: filters.search,
      isActive: filters.isActive,
      tags: filters.tags,
    })
  );

  if (isLoading) {
    return <LoadingState title="Loading Agents" description="Please wait while we load the agents" />;
  }

  if (error) {
    return <ErrorState title="Error Loading Agents" description={error.message} />;
  }

  if (!data?.items) {
    return <ErrorState title="No Data" description="Agents data not found." />;
  }

  const handleRowClick = (agent: AgentGetOne) => {
    router.push(`/agents/${agent.id}`);
  };

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4">Agents</h1>
        <Button className="mb-4" onClick={() => setIsDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Agent
        </Button>
      </div>

      <div className="flex-1 pb-4 md:px-8 flex flex-col gap-y-4">
        {/* 🔹 Filters */}
        <AgentsFilters onFiltersChange={setFilters} />

        {/* 🔹 DataTable with server-side pagination */}
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          pageCount={data?.totalPages ?? 0}
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          onPaginationChange={setPagination}
          onRowClick={handleRowClick}
          isLoading={isLoading}
        />

        {data.items.length === 0 && (
          <div className="h-[300px]">
            <EmptyState
              title={filters.search || filters.isActive !== null || filters.tags ? "No agents found" : "Create your first agent"}
              description={
                filters.search || filters.isActive !== null || filters.tags
                  ? "No agents match your current filters. Try adjusting your search criteria."
                  : "Create a new agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
              }
            />
          </div>
        )}
      </div>
    </>
  );
};
