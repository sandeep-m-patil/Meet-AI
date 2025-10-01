"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const MeetingsListHeader = () => { 

  return (
    <>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4">Meetings</h1>
        <Button className="mb-4" onClick={() =>{}}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Meeting
        </Button>
      </div>

     
    </>
  );
};
