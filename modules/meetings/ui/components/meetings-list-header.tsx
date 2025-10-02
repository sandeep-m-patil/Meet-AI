"use client";

import { NewMeetingDialog } from "@/components/meetings/new-meeting-dialog";

export const MeetingsListHeader = () => { 

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4">Meetings</h1>
        <NewMeetingDialog />
      </div>
    </>
  );
};
