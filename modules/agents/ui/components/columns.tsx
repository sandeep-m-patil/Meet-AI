"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentGetOne } from "../../types";
import { GeneratedAvatar } from "@/components/avatar/generated-avatar";
import { CornerDownRightIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";


export const columns: ColumnDef<AgentGetOne>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-left">Agent</div>,
    cell: ({ row }) => {
      const { name, instructions } = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <GeneratedAvatar
              variant="botttsNeutral"
              seed={name}
              className="h-8 w-8 rounded-full border"
            />
            <span className="font-medium text-sm capitalize">{name}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-xs gap-2 pl-11">
            <CornerDownRightIcon className="h-3 w-3 shrink-0" />
            <span className="truncate max-w-[250px] capitalize">
              {instructions || "No instructions"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "meetingCount",
    header: () => <div className="text-left">Meetings</div>,
    cell: ({ row }) => {
      const count = row.original.meetingCount ?? 0;

      return (
        <Badge
          variant="outline"
          className="p-2"
        >
          <VideoIcon className="h-4 w-4 text-blue-600" />
          <span>
            {count} {count === 1 ? "Meeting" : "Meetings"}
          </span>
        </Badge>
      );
    },
  },
  
];