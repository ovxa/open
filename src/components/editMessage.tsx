import { useState, useEffect, Dispatch, useContext } from "react";
import { Tr, langCodeContext, LANG_OPTIONS, tr } from "@/translate";
import { ChatStore, ChatStoreMessage } from "@/types/chatstore";
import { EditMessageString } from "@/components/editMessageString";
import { EditMessageDetail } from "@/components/editMessageDetail";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { AppChatStoreContext, AppContext } from "../pages/App";

interface EditMessageProps {
  chat: ChatStoreMessage;
  showEdit: boolean;
  setShowEdit: Dispatch<boolean>;
}
export function EditMessage(props: EditMessageProps) {
  const { chatStore, setChatStore } = useContext(AppChatStoreContext);

  const { showEdit, setShowEdit, chat } = props;

  return (
    <Dialog open={showEdit} onOpenChange={setShowEdit}>
      {/* <DialogTrigger>
        <button className="btn btn-sm btn-outline"></button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>
            Make changes to the message content.
          </DialogDescription>
        </DialogHeader>
        {typeof chat.content === "string" ? (
          <EditMessageString chat={chat} setShowEdit={setShowEdit} />
        ) : (
          <EditMessageDetail chat={chat} setShowEdit={setShowEdit} />
        )}
        {chatStore.develop_mode && (
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              const confirm = window.confirm(
                "Change message type will clear the content, are you sure?"
              );
              if (!confirm) return;

              if (typeof chat.content === "string") {
                chat.content = [];
              } else {
                chat.content = "";
              }
              setChatStore({ ...chatStore });
            }}
          >
            Switch to{" "}
            {typeof chat.content === "string"
              ? "media message"
              : "string message"}
          </Button>
        )}
        <Button onClick={() => setShowEdit(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
