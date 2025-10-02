"use client"
import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query';
import React, { useState, useCallback } from 'react'
import { MeetingsTable } from '@/components/meetings/meetings-table';
import { MeetingsSearchFilters } from '@/components/meetings/meetings-search-filters';
import { MeetingsPagination } from '@/components/meetings/meetings-pagination';

export default function MeetingsView() {
  const trpc = useTRPC();
  
  // Search and pagination state
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });
  
  const [paginationState, setPaginationState] = useState({
    page: 1,
    pageSize: 25,
  });
  
  const { data: meetingsData, isLoading: meetingsLoading, error: meetingsError } = useQuery(
    trpc.meetings.getMany.queryOptions({
      page: paginationState.page,
      pageSize: paginationState.pageSize,
      search: filters.search.trim() || undefined,
      // Note: Removing status, sortBy, sortOrder for now as they may not be supported by the API
      // We'll filter and sort on the client side if needed
    })
  );

  const { data: agentsData, isLoading: agentsLoading, error: agentsError } = useQuery(
    trpc.agents.getMany.queryOptions({
      page: 1,
      pageSize: 50, // Get more agents for the table
    })
  );

  // Handler functions - must be defined before any early returns
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setPaginationState(prev => ({ ...prev, page: 1 })); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPaginationState(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPaginationState(prev => ({ ...prev, pageSize, page: 1 })); // Reset to first page when page size changes
  }, []);

  // Process data - must be done before conditional returns to avoid hook order issues
  const rawMeetings = meetingsData?.data || [];
  const agents = agentsData?.items || [];
  
  // Client-side filtering and sorting
  const filteredAndSortedMeetings = React.useMemo(() => {
    let result = [...rawMeetings];
    
    // Filter by search term
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter(meeting => 
        meeting.name.toLowerCase().includes(searchTerm) ||
        meeting.id.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by status
    if (filters.status !== "all") {
      result = result.filter(meeting => meeting.status === filters.status);
    }
    
    // Sort
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "updatedAt":
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case "createdAt":
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }
      
      if (aValue < bValue) return filters.sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [rawMeetings, filters.search, filters.status, filters.sortBy, filters.sortOrder]);

  if (meetingsLoading || agentsLoading) {
    return <LoadingState title="Loading Meetings" description="Please wait while we load the meetings" />;
  }

  if (meetingsError) {
    return <ErrorState title="Error Loading Meetings" description={meetingsError.message} />;
  }

  if (agentsError) {
    return <ErrorState title="Error Loading Agents" description={agentsError.message} />;
  }

  if (!meetingsData) {
    return <ErrorState title="No Data" description="Meetings data not found." />;
  }
  
  const meetings = filteredAndSortedMeetings;
  const paginationInfo = meetingsData?.pagination || {
    page: paginationState.page,
    pageSize: paginationState.pageSize,
    total: 0,
    totalPages: 0,
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Only */}
      <MeetingsSearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isLoading={meetingsLoading}
        totalResults={meetings.length}
      />
      
      {/* Meetings Table */}
      <MeetingsTable meetings={meetings} agents={agents} />
      
      {/* Bottom Pagination Only */}
      <MeetingsPagination
        pagination={paginationInfo}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={meetingsLoading}
      />
    </div>
  )
}
