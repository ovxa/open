import { XMarkIcon } from "@heroicons/react/24/outline";
import Markdown from "react-markdown";
import { useContext, useState, useMemo } from "react";
import { ChatStoreMessage } from "@/types/chatstore";
import { addTotalCost } from "@/utils/totalCost";

import { Tr } from "@/translate";
import { getMessageText } from "@/chatgpt";
import { EditMessage } from "@/editMessage";
import logprobToColor from "@/utils/logprob";
import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
} from "@/components/ui/chat/chat-bubble";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ClipboardIcon,
  PencilIcon,
  MessageSquareOffIcon,
  MessageSquarePlusIcon,
  AudioLinesIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { AppContext } from "@/pages/App";

interface HideMessageProps {
  chat: ChatStoreMessage;
}

function MessageHide({ chat }: HideMessageProps) {
  return (
    <>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{getMessageText(chat).split("\n")[0].slice(0, 28)} ...</span>
      </div>
      <div className="flex mt-2 justify-center">
        <Badge variant="destructive">Removed from context</Badge>
      </div>
    </>
  );
}

interface MessageDetailProps {
  chat: ChatStoreMessage;
  renderMarkdown: boolean;
}
function MessageDetail({ chat, renderMarkdown }: MessageDetailProps) {
  if (typeof chat.content === "string") {
    return <div></div>;
  }
  return (
    <div>
      {chat.content.map((mdt) =>
        mdt.type === "text" ? (
          chat.hide ? (
            mdt.text?.split("\n")[0].slice(0, 16) + " ..."
          ) : renderMarkdown ? (
            <Markdown>{mdt.text}</Markdown>
          ) : (
            mdt.text
          )
        ) : (
          <img
            className="my-2 rounded-md max-w-64 max-h-64"
            src={mdt.image_url?.url}
            key={mdt.image_url?.url}
            onClick={() => {
              window.open(mdt.image_url?.url, "_blank");
            }}
          />
        )
      )}
    </div>
  );
}

interface ToolCallMessageProps {
  chat: ChatStoreMessage;
  copyToClipboard: (text: string) => void;
}
function MessageToolCall({ chat, copyToClipboard }: ToolCallMessageProps) {
  return (
    <div className="message-content">
      {chat.tool_calls?.map((tool_call) => (
        <div className="bg-blue-300 dark:bg-blue-800 p-1 rounded my-1">
          <strong>
            Tool Call ID:{" "}
            <span
              className="p-1 m-1 rounded cursor-pointer hover:opacity-50 hover:underline"
              onClick={() => copyToClipboard(String(tool_call.id))}
            >
              {tool_call?.id}
            </span>
          </strong>
          <p>Type: {tool_call?.type}</p>
          <p>
            Function:
            <span
              className="p-1 m-1 rounded cursor-pointer hover:opacity-50 hover:underline"
              onClick={() => copyToClipboard(tool_call.function.name)}
            >
              {tool_call.function.name}
            </span>
          </p>
          <p>
            Arguments:
            <span
              className="p-1 m-1 rounded cursor-pointer hover:opacity-50 hover:underline"
              onClick={() => copyToClipboard(tool_call.function.arguments)}
            >
              {tool_call.function.arguments}
            </span>
          </p>
        </div>
      ))}
      {/* [TODO] */}
      {chat.content as string}
    </div>
  );
}

interface ToolRespondMessageProps {
  chat: ChatStoreMessage;
  copyToClipboard: (text: string) => void;
}
function MessageToolResp({ chat, copyToClipboard }: ToolRespondMessageProps) {
  return (
    <div className="message-content">
      <div className="bg-blue-300 dark:bg-blue-800 p-1 rounded my-1">
        <strong>
          Tool Response ID:{" "}
          <span
            className="p-1 m-1 rounded cursor-pointer hover:opacity-50 hover:underline"
            onClick={() => copyToClipboard(String(chat.tool_call_id))}
          >
            {chat.tool_call_id}
          </span>
        </strong>
        {/* [TODO] */}
        <p>{chat.content as string}</p>
      </div>
    </div>
  );
}

interface TTSProps {
  chat: ChatStoreMessage;
}
interface TTSPlayProps {
  chat: ChatStoreMessage;
}
export function TTSPlay(props: TTSPlayProps) {
  const src = useMemo(() => {
    if (props.chat.audio instanceof Blob) {
      return URL.createObjectURL(props.chat.audio);
    }
    return "";
  }, [props.chat.audio]);

  if (props.chat.hide) {
    return <></>;
  }
  if (props.chat.audio instanceof Blob) {
    return <audio className="w-64" src={src} controls />;
  }
  return <></>;
}
function TTSButton(props: TTSProps) {
  const [generating, setGenerating] = useState(false);
  const ctx = useContext(AppContext);
  if (!ctx) return <div>error</div>;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        const api = ctx.chatStore.tts_api;
        const api_key = ctx.chatStore.tts_key;
        const model = "tts-1";
        const input = getMessageText(props.chat);
        const voice = ctx.chatStore.tts_voice;

        const body: Record<string, any> = {
          model,
          input,
          voice,
          response_format: ctx.chatStore.tts_format || "mp3",
        };
        if (ctx.chatStore.tts_speed_enabled) {
          body["speed"] = ctx.chatStore.tts_speed;
        }

        setGenerating(true);

        fetch(api, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${api_key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((response) => response.blob())
          .then((blob) => {
            // update price
            const cost = (input.length * 0.015) / 1000;
            ctx.chatStore.cost += cost;
            addTotalCost(cost);
            ctx.setChatStore({ ...ctx.chatStore });

            // save blob
            props.chat.audio = blob;
            ctx.setChatStore({ ...ctx.chatStore });

            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play();
          })
          .finally(() => {
            setGenerating(false);
          });
      }}
    >
      {generating ? (
        <LoaderCircleIcon className="h-4 w-4 animate-spin" />
      ) : (
        <AudioLinesIcon className="h-4 w-4" />
      )}
    </Button>
  );
}

export default function Message(props: { messageIndex: number }) {
  const ctx = useContext(AppContext);
  if (ctx === null) return <></>;
  const { messageIndex } = props;
  const { chatStore, setChatStore } = ctx;

  const chat = chatStore.history[messageIndex];
  const [showEdit, setShowEdit] = useState(false);
  const [renderMarkdown, setRenderWorkdown] = useState(false);
  const [renderColor, setRenderColor] = useState(false);

  const { toast } = useToast();
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: Tr("Message copied to clipboard!"),
      });
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast({
          description: Tr("Message copied to clipboard!"),
        });
      } catch (err) {
        toast({
          description: Tr("Failed to copy to clipboard"),
        });
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <>
      {chatStore.postBeginIndex !== 0 &&
        !chatStore.history[messageIndex].hide &&
        chatStore.postBeginIndex ===
          chatStore.history.slice(0, messageIndex).filter(({ hide }) => !hide)
            .length && (
          <div className="flex items-center relative justify-center">
            <hr className="w-full h-px my-4 border-0" />
            <span className="absolute px-3 rounded p-1">
              Above messages are "forgotten"
            </span>
          </div>
        )}
      <ChatBubble
        variant={chat.role === "assistant" ? "received" : "sent"}
        className={chat.role !== "assistant" ? "flex-row-reverse" : ""}
      >
        <ChatBubbleMessage isLoading={false}>
          {chat.hide ? (
            <MessageHide chat={chat} />
          ) : typeof chat.content !== "string" ? (
            <MessageDetail chat={chat} renderMarkdown={renderMarkdown} />
          ) : chat.tool_calls ? (
            <MessageToolCall chat={chat} copyToClipboard={copyToClipboard} />
          ) : chat.role === "tool" ? (
            <MessageToolResp chat={chat} copyToClipboard={copyToClipboard} />
          ) : renderMarkdown ? (
            <Markdown>{getMessageText(chat)}</Markdown>
          ) : (
            <div className="message-content">
              {chat.content &&
                (chat.logprobs && renderColor
                  ? chat.logprobs.content
                      .filter((c) => c.token)
                      .map((c) => (
                        <div
                          style={{
                            backgroundColor: logprobToColor(c.logprob),
                            display: "inline",
                          }}
                        >
                          {c.token}
                        </div>
                      ))
                  : getMessageText(chat))}
            </div>
          )}
        </ChatBubbleMessage>
        <ChatBubbleActionWrapper>
          <ChatBubbleAction
            icon={
              chat.hide ? (
                <MessageSquarePlusIcon className="size-4" />
              ) : (
                <MessageSquareOffIcon className="size-4" />
              )
            }
            onClick={() => {
              chatStore.history[messageIndex].hide =
                !chatStore.history[messageIndex].hide;
              chatStore.totalTokens = 0;
              for (const i of chatStore.history
                .filter(({ hide }) => !hide)
                .slice(chatStore.postBeginIndex)
                .map(({ token }) => token)) {
                chatStore.totalTokens += i;
              }
              setChatStore({ ...chatStore });
            }}
          />
          <ChatBubbleAction
            icon={<PencilIcon className="size-4" />}
            onClick={() => setShowEdit(true)}
          />
          <ChatBubbleAction
            icon={<ClipboardIcon className="size-4" />}
            onClick={() => copyToClipboard(getMessageText(chat))}
          />
          {chatStore.tts_api && chatStore.tts_key && <TTSButton chat={chat} />}
          <TTSPlay chat={chat} />
        </ChatBubbleActionWrapper>
      </ChatBubble>
      <EditMessage showEdit={showEdit} setShowEdit={setShowEdit} chat={chat} />
      {chatStore.develop_mode && (
        <div
          className={`flex flex-wrap items-center gap-2 mt-2 ${
            chat.role !== "assistant" ? "justify-end" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">token</span>
            <input
              type="number"
              value={chat.token}
              className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
              readOnly
            />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-sm opacity-70 hover:opacity-100 h-8 w-8"
              onClick={() => {
                chatStore.history.splice(messageIndex, 1);
                chatStore.postBeginIndex = Math.max(
                  chatStore.postBeginIndex - 1,
                  0
                );
                chatStore.totalTokens = 0;
                for (const i of chatStore.history
                  .filter(({ hide }) => !hide)
                  .slice(chatStore.postBeginIndex)
                  .map(({ token }) => token)) {
                  chatStore.totalTokens += i;
                }
                setChatStore({ ...chatStore });
              }}
            >
              <XMarkIcon className="size-4" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-primary"
                checked={chat.example}
                onChange={() => {
                  chat.example = !chat.example;
                  setChatStore({ ...chatStore });
                }}
              />
              <span className="text-sm font-medium">{Tr("example")}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-primary"
                checked={renderMarkdown}
                onChange={() => setRenderWorkdown(!renderMarkdown)}
              />
              <span className="text-sm font-medium">{Tr("render")}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-primary"
                checked={renderColor}
                onChange={() => setRenderColor(!renderColor)}
              />
              <span className="text-sm font-medium">{Tr("color")}</span>
            </label>
            {chat.response_model_name && (
              <>
                <span className="opacity-50">{chat.response_model_name}</span>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
