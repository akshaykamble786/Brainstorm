"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";
import DynamicBreadcrumb from "./CustomBreadcrumb";
import { Bell } from "lucide-react";
import NotificationSystem from "./NotificationSystem";
import { useSyncStatus } from "@liveblocks/react/suspense";
import { MessageSquareText, X } from "lucide-react";
import { Comments } from "./CommentSection";
// import { ClientSideSuspense } from "@liveblocks/react/suspense";
// import { Loader2Icon } from "lucide-react";
// import { Avataars } from "@/components/Avataars";

const DocumentHeader = ({ workspaceName }) => {
  const syncStatus = useSyncStatus({ smooth: true });

  return (
    <div className="sticky flex items-center justify-between p-[15px] border-b">
      <div className="flex flex-col gap-2">
        <DynamicBreadcrumb />
        <h2 className="text-lg font-semibold">{workspaceName}</h2>
      </div>

      <div className="flex items-center space-x-5">
        {/* <ClientSideSuspense fallback={<Loader2Icon />}>
          <Avataars />
        </ClientSideSuspense> */}

        <NotificationSystem>
          <Bell className="size-5 cursor-pointer" />
        </NotificationSystem>

        <Comments>
          <MessageSquareText className="size-6 cursor-pointer" />
        </Comments>

        {syncStatus === "synchronizing" ? (
          <Badge variant="secondary" className="bg-orange-600">
            Saving...
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-emerald-600">
            Saved
          </Badge>
        )}
      </div>
    </div>
  );
};

export default DocumentHeader;
