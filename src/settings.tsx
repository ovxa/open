import { createRef } from "preact";
import { StateUpdater, useContext, useEffect, useState } from "preact/hooks";
import {
  ChatStore,
  TemplateAPI,
  TemplateTools,
  clearTotalCost,
  getTotalCost,
} from "./app";
import models from "./models";
import { TemplateChatStore } from "./chatbox";
import { tr, Tr, langCodeContext, LANG_OPTIONS } from "./translate";
import p from "preact-markdown";
import { isVailedJSON } from "./message";
import { SetAPIsTemplate } from "./setAPIsTemplate";
import { autoHeight } from "./textarea";
import getDefaultParams from "./getDefaultParam";

import {
  InformationCircleIcon,
  CheckIcon,
  NoSymbolIcon,
  CogIcon,
  KeyIcon,
  EyeIcon,
  EllipsisHorizontalCircleIcon,
  HandRaisedIcon,
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

import { themeChange } from "theme-change";

const TTS_VOICES: string[] = [
  "alloy",
  "echo",
  "fable",
  "onyx",
  "nova",
  "shimmer",
];
const TTS_FORMAT: string[] = ["mp3", "opus", "aac", "flac"];

const Help = (props: { children: any; help: string; field: string }) => {
  return (
    <div class="b-2">
      <label class="form-control w-full">{props.children}</label>
    </div>
  );
};

const SelectModel = (props: {
  chatStore: ChatStore;
  setChatStore: (cs: ChatStore) => void;
  help: string;
}) => {
  let shouldIUseCustomModel: boolean = true;
  for (const model in models) {
    if (props.chatStore.model === model) {
      shouldIUseCustomModel = false;
    }
  }
  const [useCustomModel, setUseCustomModel] = useState(shouldIUseCustomModel);
  return (
    <Help help={props.help} field="">
      <div class="label">
        <span class="flex gap-2 items-center">
          <ListBulletIcon class="w-4 h-4" />
          Model
        </span>{" "}
        <div class="flex gap-3">
          <span class="label-text">
            <span class="label-text flex gap-2 items-center">
              <Cog6ToothIcon class="w-4 h-4" />
              {Tr("Custom")}
            </span>
          </span>
          <span class="label-text-alt">
            <input
              type="checkbox"
              checked={useCustomModel}
              class="checkbox"
              onClick={() => {
                setUseCustomModel(!useCustomModel);
              }}
            />
          </span>
        </div>
        {/* <span class="label-text-alt">Top Right label</span> */}
      </div>
      <label class="form-control w-full">
        {useCustomModel ? (
          <input
            className="input input-bordered"
            value={props.chatStore.model}
            onChange={(event: any) => {
              const model = event.target.value as string;
              props.chatStore.model = model;
              props.setChatStore({ ...props.chatStore });
            }}
          />
        ) : (
          <select
            className="select select-bordered"
            value={props.chatStore.model}
            onChange={(event: any) => {
              const model = event.target.value as string;
              props.chatStore.model = model;
              props.chatStore.maxTokens = getDefaultParams(
                "max",
                models[model].maxToken
              );
              props.setChatStore({ ...props.chatStore });
            }}
          >
            {Object.keys(models).map((opt) => (
              <option value={opt}>{opt}</option>
            ))}
          </select>
        )}
      </label>
      <div class="pb-5"></div>
    </Help>
  );
};

const LongInput = (props: {
  chatStore: ChatStore;
  setChatStore: (cs: ChatStore) => void;
  field: "systemMessageContent" | "toolsString";
  label: string;
  help: string;
}) => {
  return (
    <label class="form-control">
      <div class="label">
        <span class="label-text">{props.label}</span>
        <span class="label-text-alt">
          <button
            onClick={() => {
              alert(props.help);
            }}
          >
            <InformationCircleIcon className="w-4 h-4" />
          </button>
        </span>
      </div>
      <textarea
        className="textarea textarea-bordered h-24 w-full"
        value={props.chatStore[props.field]}
        onChange={(event: any) => {
          props.chatStore[props.field] = event.target.value;
          props.setChatStore({ ...props.chatStore });
          autoHeight(event.target);
        }}
        onKeyPress={(event: any) => {
          autoHeight(event.target);
        }}
      ></textarea>
    </label>
  );
};

const Input = (props: {
  chatStore: ChatStore;
  setChatStore: (cs: ChatStore) => void;
  field:
    | "apiKey"
    | "apiEndpoint"
    | "whisper_api"
    | "whisper_key"
    | "tts_api"
    | "tts_key"
    | "image_gen_api"
    | "image_gen_key";
  help: string;
}) => {
  const [hideInput, setHideInput] = useState(true);
  return (
    <Help field={props.field} help={props.help}>
      <div class="label">
        <span class="label-text">{props.field}</span>
        <span class="label-text-alt">
          <button
            onClick={() => {
              alert(props.help);
            }}
          >
            <InformationCircleIcon className="w-4 h-4" />
          </button>
        </span>
      </div>
      <div class="join">
        <label class="input input-bordered flex items-center gap-2 join-item grow">
          {hideInput ? (
            <EyeIcon
              class="w-4 h-4"
              onClick={() => {
                setHideInput(!hideInput);
                console.log("clicked", hideInput);
              }}
            />
          ) : (
            <KeyIcon
              class="w-4 h-4"
              onClick={() => {
                setHideInput(!hideInput);
                console.log("clicked", hideInput);
              }}
            />
          )}

          <input
            type={hideInput ? "password" : "text"}
            class="grow"
            value={props.chatStore[props.field]}
            onChange={(event: any) => {
              props.chatStore[props.field] = event.target.value;
              props.setChatStore({ ...props.chatStore });
            }}
          />
        </label>
      </div>
    </Help>
  );
};

const Slicer = (props: {
  chatStore: ChatStore;
  setChatStore: (cs: ChatStore) => void;
  field: "temperature" | "top_p" | "tts_speed";
  help: string;
  min: number;
  max: number;
}) => {
  const enable_filed_name: "temperature_enabled" | "top_p_enabled" =
    `${props.field}_enabled` as any;

  const enabled = props.chatStore[enable_filed_name];

  if (enabled === null || enabled === undefined) {
    if (props.field === "temperature") {
      props.chatStore[enable_filed_name] = true;
    }
    if (props.field === "top_p") {
      props.chatStore[enable_filed_name] = false;
    }
  }

  const setEnabled = (state: boolean) => {
    props.chatStore[enable_filed_name] = state;
    props.setChatStore({ ...props.chatStore });
  };
  return (
    <Help help={props.help} field={props.field}>
      <span>
        <div class="form-control">
          <label class="flex gap-2">
            <span class="label-text flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              {props.field}{" "}
              <button
                onClick={() => {
                  alert(props.help);
                }}
              >
                <InformationCircleIcon className="w-4 h-4" />
              </button>
            </span>
            <input
              type="checkbox"
              checked={props.chatStore[enable_filed_name]}
              class="checkbox"
              onClick={() => {
                setEnabled(!enabled);
              }}
            />
          </label>
        </div>
      </span>
      {enabled ? (
        <div class="flex items-center">
          <input
            disabled={!enabled}
            className="range"
            type="range"
            min={props.min}
            max={props.max}
            step="0.01"
            value={props.chatStore[props.field]}
            onChange={(event: any) => {
              const value = parseFloat(event.target.value);
              props.chatStore[props.field] = value;
              props.setChatStore({ ...props.chatStore });
            }}
          />
          <input
            disabled={!enabled}
            className="m-2 p-2 border rounded focus w-28"
            type="number"
            value={props.chatStore[props.field]}
            onChange={(event: any) => {
              const value = parseFloat(event.target.value);
              props.chatStore[props.field] = value;
              props.setChatStore({ ...props.chatStore });
            }}
          />
        </div>
      ) : (
        ""
      )}
    </Help>
  );
};

const Number = (props: {
  chatStore: ChatStore;
  setChatStore: (cs: ChatStore) => void;
  field:
    | "totalTokens"
    | "maxTokens"
    | "maxGenTokens"
    | "tokenMargin"
    | "postBeginIndex"
    | "presence_penalty"
    | "frequency_penalty";
  readOnly: boolean;
  help: string;
}) => {
  return (
    <Help help={props.help} field="">
      <span>
        <label className="py-2 flex items-center gap-1">
          <EllipsisHorizontalCircleIcon class="h-4 w-4" /> {props.field}{" "}
          <button
            onClick={() => {
              alert(props.help);
            }}
          >
            <InformationCircleIcon className="w-4 h-4" />
          </button>
          {props.field === "maxGenTokens" && (
            <div class="form-control">
              <label class="label cursor-pointer">
                <input
                  type="checkbox"
                  checked={props.chatStore.maxGenTokens_enabled}
                  onChange={() => {
                    const newChatStore = { ...props.chatStore };
                    newChatStore.maxGenTokens_enabled =
                      !newChatStore.maxGenTokens_enabled;
                    props.setChatStore({ ...newChatStore });
                  }}
                  class="checkbox"
                />
              </label>
            </div>
          )}
        </label>
      </span>
      <input
        readOnly={props.readOnly}
        disabled={
          props.field === "maxGenTokens" &&
          !props.chatStore.maxGenTokens_enabled
        }
        type="number"
        className="input input-bordered input-sm w-full max-w-xs"
        value={props.chatStore[props.field]}
        onChange={(event: any) => {
          console.log("type", typeof event.target.value);
          let newNumber = parseFloat(event.target.value);
          if (newNumber < 0) newNumber = 0;
          props.chatStore[props.field] = newNumber;
          props.setChatStore({ ...props.chatStore });
        }}
      ></input>
    </Help>
  );
};
const Choice = (props: {
  chatStore: ChatStore;
  setChatStore: (cs: ChatStore) => void;
  field: "streamMode" | "develop_mode" | "json_mode" | "logprobs";
  help: string;
}) => {
  return (
    <Help help={props.help} field={props.field}>
      <div class="form-control">
        <label class="py-2 flex items-center gap-1">
          <CheckIcon class="h-4 w-4" />
          <span class="label-text">{props.field}</span>
          <button
            onClick={() => {
              alert(props.help);
            }}
          >
            <InformationCircleIcon className="w-4 h-4" />
          </button>
          <input
            type="checkbox"
            checked={props.chatStore[props.field]}
            class="checkbox"
            onChange={(event: any) => {
              props.chatStore[props.field] = event.target.checked;
              props.setChatStore({ ...props.chatStore });
            }}
          />
        </label>
      </div>
    </Help>
  );
};

export default (props: {
  chatStore: ChatStore;
  setChatStore: (cs: ChatStore) => void;
  setShow: StateUpdater<boolean>;
  selectedChatStoreIndex: number;
  templates: TemplateChatStore[];
  setTemplates: (templates: TemplateChatStore[]) => void;
  templateAPIs: TemplateAPI[];
  setTemplateAPIs: (templateAPIs: TemplateAPI[]) => void;
  templateAPIsWhisper: TemplateAPI[];
  setTemplateAPIsWhisper: (templateAPIs: TemplateAPI[]) => void;
  templateAPIsTTS: TemplateAPI[];
  setTemplateAPIsTTS: (templateAPIs: TemplateAPI[]) => void;
  templateAPIsImageGen: TemplateAPI[];
  setTemplateAPIsImageGen: (templateAPIs: TemplateAPI[]) => void;
  templateTools: TemplateTools[];
  setTemplateTools: (templateTools: TemplateTools[]) => void;
}) => {
  let link =
    location.protocol +
    "//" +
    location.host +
    location.pathname +
    `?key=${encodeURIComponent(
      props.chatStore.apiKey
    )}&api=${encodeURIComponent(props.chatStore.apiEndpoint)}&mode=${
      props.chatStore.streamMode ? "stream" : "fetch"
    }&model=${props.chatStore.model}&sys=${encodeURIComponent(
      props.chatStore.systemMessageContent
    )}`;
  if (props.chatStore.develop_mode) {
    link = link + `&dev=true`;
  }

  const importFileRef = createRef();
  const [totalCost, setTotalCost] = useState(getTotalCost());
  // @ts-ignore
  const { langCode, setLangCode } = useContext(langCodeContext);

  useEffect(() => {
    themeChange(false);
    const handleKeyPress = (event: any) => {
      if (event.keyCode === 27) {
        // keyCode for ESC key is 27
        props.setShow(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // The empty dependency array ensures that the effect runs only once

  return (
    <div
      onClick={() => props.setShow(false)}
      className="left-0 top-0 overflow-scroll flex justify-center absolute mt-6 w-screen h-full z-10"
    >
      <div
        onClick={(event: any) => {
          event.stopPropagation();
        }}
        className="px-6 pt-2 pb-4 rounded-lg h-fit lg:w-2/3 z-20 shadow-2xl bg-base-200"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl">
            <span>{Tr("Settings")}</span>
          </h3>
          <button
            className="btn"
            onClick={() => {
              props.setShow(false);
            }}
          >
            {Tr("Close")}
          </button>
        </div>
        <div role="tablist" class="tabs tabs-lifted pt-2 w-full">
          <input
            type="radio"
            name="setting_tab"
            role="tab"
            class="tab"
            aria-label="Session"
          />
          <div
            role="tabpanel"
            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <p>
              {Tr("Total cost in this session")} $
              {props.chatStore.cost.toFixed(4)}
            </p>
            <LongInput
              label="System Prompt"
              field="systemMessageContent"
              help="系统消息，用于指示ChatGPT的角色和一些前置条件，例如“你是一个有帮助的人工智能助理”，或者“你是一个专业英语翻译，把我的话全部翻译成英语”，详情参考 OPEAN AI API 文档"
              {...props}
            />

            <LongInput
              label="Tools String"
              field="toolsString"
              help="function call tools, should be valid json format in list"
              {...props}
            />
            <span className="pt-1">
              JSON Check:{" "}
              {isVailedJSON(props.chatStore.toolsString) ? (
                <CheckIcon className="inline w-4 h-4" />
              ) : (
                <NoSymbolIcon className="inline w-4 h-4" />
              )}
            </span>
            <div className="box">
              <div className="flex justify-evenly flex-wrap">
                {props.chatStore.toolsString.trim() && (
                  <button
                    className="btn"
                    onClick={() => {
                      const name = prompt(
                        `Give this **Tools** template a name:`
                      );
                      if (!name) {
                        alert("No template name specified");
                        return;
                      }
                      const newToolsTmp: TemplateTools = {
                        name,
                        toolsString: props.chatStore.toolsString,
                      };
                      props.templateTools.push(newToolsTmp);
                      props.setTemplateTools([...props.templateTools]);
                    }}
                  >
                    {Tr(`Save Tools`)}
                  </button>
                )}
              </div>
            </div>
          </div>
          <input
            type="radio"
            name="setting_tab"
            role="tab"
            class="tab"
            aria-label="System"
          />
          <div
            role="tabpanel"
            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div className="flex justify-between">
              <div class="join join-vertical lg:join-horizontal">
                <p class="btn no-animation join-item">
                  {Tr("Accumulated cost in all sessions")} $
                  {totalCost.toFixed(4)}
                </p>
                <button
                  class="btn join-item"
                  onClick={() => {
                    clearTotalCost();
                    setTotalCost(getTotalCost());
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">Theme Switch</span>
              </div>
              <select data-choose-theme class="select select-bordered">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="cupcake">Cupcake</option>
                <option value="halloween">Halloween</option>
                <option value="wireframe">Wireframe</option>
                <option value="sunset">Sunset</option>
                <option value="lemonade">Lemonade</option>
                <option value="luxury">Luxury</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="black">Black</option>
              </select>
            </label>
            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">Language</span>
              </div>
              <select class="select select-bordered">
                {Object.keys(LANG_OPTIONS).map((opt) => (
                  <option
                    value={opt}
                    selected={opt === (langCodeContext as any).langCode}
                    onClick={(event: any) => {
                      console.log("set lang code", event.target.value);
                      setLangCode(event.target.value);
                    }}
                  >
                    {LANG_OPTIONS[opt].name}
                  </option>
                ))}
              </select>
            </label>
            <div class="join pt-2">
              <button class="btn btn-info join-item no-animation">
                <CogIcon class="w-6 h-6" />
              </button>
              <button
                class="btn join-item"
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  alert(tr(`Copied link:`, langCode) + `${link}`);
                }}
              >
                {Tr("Copy Setting Link")}
              </button>
              <button
                class="btn join-item"
                onClick={() => {
                  if (
                    !confirm(tr("Are you sure to clear all history?", langCode))
                  )
                    return;
                  props.chatStore.history = props.chatStore.history.filter(
                    (msg) => msg.example && !msg.hide
                  );
                  props.chatStore.postBeginIndex = 0;
                  props.setChatStore({ ...props.chatStore });
                }}
              >
                {Tr("Clear History")}
              </button>
              <button
                class="btn join-item"
                onClick={() => {
                  let dataStr =
                    "data:text/json;charset=utf-8," +
                    encodeURIComponent(
                      JSON.stringify(props.chatStore, null, "\t")
                    );
                  let downloadAnchorNode = document.createElement("a");
                  downloadAnchorNode.setAttribute("href", dataStr);
                  downloadAnchorNode.setAttribute(
                    "download",
                    `chatgpt-api-web-${props.selectedChatStoreIndex}.json`
                  );
                  document.body.appendChild(downloadAnchorNode); // required for firefox
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                }}
              >
                {Tr("Export")}
              </button>
              <button
                class="btn join-item"
                onClick={() => {
                  const name = prompt(
                    tr("Give this template a name:", langCode)
                  );
                  if (!name) {
                    alert(tr("No template name specified", langCode));
                    return;
                  }
                  const tmp: ChatStore = structuredClone(props.chatStore);
                  tmp.history = tmp.history.filter((h) => h.example);
                  // clear api because it is stored in the API template
                  tmp.apiEndpoint = "";
                  tmp.apiKey = "";
                  tmp.whisper_api = "";
                  tmp.whisper_key = "";
                  tmp.tts_api = "";
                  tmp.tts_key = "";
                  tmp.image_gen_api = "";
                  tmp.image_gen_key = "";
                  // @ts-ignore
                  tmp.name = name;
                  props.templates.push(tmp as TemplateChatStore);
                  props.setTemplates([...props.templates]);
                }}
              >
                {Tr("As template")}
              </button>
              <button
                class="btn join-item"
                onClick={() => {
                  if (
                    !confirm(
                      tr(
                        "This will OVERWRITE the current chat history! Continue?",
                        langCode
                      )
                    )
                  )
                    return;
                  console.log("importFileRef", importFileRef);
                  importFileRef.current.click();
                }}
              >
                Import
              </button>
              <input
                className="hidden"
                ref={importFileRef}
                type="file"
                onChange={() => {
                  const file = importFileRef.current.files[0];
                  console.log("file to import", file);
                  if (!file || file.type !== "application/json") {
                    alert(tr("Please select a json file", langCode));
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => {
                    console.log("import content", reader.result);
                    if (!reader) {
                      alert(tr("Empty file", langCode));
                      return;
                    }
                    try {
                      const newChatStore: ChatStore = JSON.parse(
                        reader.result as string
                      );
                      if (!newChatStore.chatgpt_api_web_version) {
                        throw tr(
                          "This is not an exported chatgpt-api-web chatstore file. The key 'chatgpt_api_web_version' is missing!",
                          langCode
                        );
                      }
                      props.setChatStore({ ...newChatStore });
                    } catch (e) {
                      alert(
                        tr(`Import error on parsing json:`, langCode) + `${e}`
                      );
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </div>
          </div>
          <input
            type="radio"
            name="setting_tab"
            role="tab"
            class="tab"
            aria-label="Chat"
          />
          <div
            role="tabpanel"
            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div class="card bg-base-100 w-full shadow-xl">
              <div class="card-body">
                <h2 class="card-title">Chat API</h2>
                <p>
                  <Input
                    field="apiKey"
                    help="OPEN AI API 密钥，请勿泄漏此密钥"
                    {...props}
                  />
                  <Input
                    field="apiEndpoint"
                    help="API 端点，方便在不支持的地区使用反向代理服务，默认为 https://api.openai.com/v1/chat/completions"
                    {...props}
                  />
                </p>
                <div class="card-actions justify-end">
                  <SetAPIsTemplate
                    label="Chat API"
                    endpoint={props.chatStore.apiEndpoint}
                    APIkey={props.chatStore.apiKey}
                    tmps={props.templateAPIs}
                    setTmps={props.setTemplateAPIs}
                  />
                </div>
              </div>
            </div>
            <SelectModel
              help="模型，默认 3.5。不同模型性能和定价也不同，请参考 API 文档。"
              {...props}
            />
            <Slicer
              field="temperature"
              min={0}
              max={2}
              help="温度，数值越大模型生成文字的随机性越高。"
              {...props}
            />
            <Choice
              field="streamMode"
              help="流模式，使用 stream mode 将可以动态看到生成内容，但无法准确计算 token 数量，在 token 数量过多时可能会裁切过多或过少历史消息"
              {...props}
            />
            <Choice field="logprobs" help="返回每个Token的概率" {...props} />
            <Choice
              field="develop_mode"
              help="开发者模式，开启后会显示更多选项及功能"
              {...props}
            />
            <Number
              field="maxTokens"
              help="最大上下文 token 数量。此值会根据选择的模型自动设置。"
              readOnly={false}
              {...props}
            />
            <Number
              field="maxGenTokens"
              help="最大生成 Tokens 数量，可选值。"
              readOnly={false}
              {...props}
            />
            <Number
              field="tokenMargin"
              help="当 totalTokens > maxTokens - tokenMargin 时会触发历史消息裁切，chatgpt会“忘记”一部分对话中的消息（但所有历史消息仍然保存在本地）"
              readOnly={false}
              {...props}
            />
            <Choice field="json_mode" help="JSON Mode" {...props} />
            <Number
              field="postBeginIndex"
              help="指示发送 API 请求时要”忘记“多少历史消息"
              readOnly={true}
              {...props}
            />
            <Number
              field="totalTokens"
              help="token总数，每次对话都会更新此参数，stream模式下该参数为估计值"
              readOnly={true}
              {...props}
            />
            <Slicer
              field="top_p"
              min={0}
              max={1}
              help="Top P 采样方法。建议与温度采样方法二选一，不要同时开启。"
              {...props}
            />
            <Number
              field="presence_penalty"
              help="存在惩罚度"
              readOnly={false}
              {...props}
            />
            <Number
              field="frequency_penalty"
              help="频率惩罚度"
              readOnly={false}
              {...props}
            />
          </div>

          <input
            type="radio"
            name="setting_tab"
            role="tab"
            class="tab"
            aria-label="Speech Recognition"
          />
          <div
            role="tabpanel"
            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div class="card bg-base-100 w-full shadow-xl">
              <div class="card-body">
                <h2 class="card-title">Whisper API</h2>
                <p>
                  <Input
                    field="whisper_key"
                    help="用于 Whisper 服务的 key，默认为 上方使用的OPENAI key，可在此单独配置专用key"
                    {...props}
                  />
                  <Input
                    field="whisper_api"
                    help="Whisper 语言转文字服务，填入此api才会开启，默认为 https://api.openai.com/v1/audio/transriptions"
                    {...props}
                  />
                </p>
                <div class="card-actions justify-end">
                  <SetAPIsTemplate
                    label="Whisper API"
                    endpoint={props.chatStore.whisper_api}
                    APIkey={props.chatStore.whisper_key}
                    tmps={props.templateAPIsWhisper}
                    setTmps={props.setTemplateAPIsWhisper}
                  />
                </div>
              </div>
            </div>
          </div>
          <input
            type="radio"
            name="setting_tab"
            role="tab"
            class="tab"
            aria-label="TTS"
          />
          <div
            role="tabpanel"
            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div class="card bg-base-100 w-full shadow-xl">
              <div class="card-body">
                <h2 class="card-title">TTS API</h2>
                <p>
                  <Input
                    field="tts_key"
                    help="tts service api key"
                    {...props}
                  />
                  <Input
                    field="tts_api"
                    help="tts api, eg. https://api.openai.com/v1/audio/speech"
                    {...props}
                  />
                </p>
                <div class="card-actions justify-end">
                  <SetAPIsTemplate
                    label="TTS API"
                    endpoint={props.chatStore.tts_api}
                    APIkey={props.chatStore.tts_key}
                    tmps={props.templateAPIsTTS}
                    setTmps={props.setTemplateAPIsTTS}
                  />
                </div>
              </div>
            </div>
            <Help help="tts voice style" field="AAAAA">
              <label className="">TTS Voice</label>
              <select
                className="select select-bordered"
                value={props.chatStore.tts_voice}
                onChange={(event: any) => {
                  const voice = event.target.value as string;
                  props.chatStore.tts_voice = voice;
                  props.setChatStore({ ...props.chatStore });
                }}
              >
                {TTS_VOICES.map((opt) => (
                  <option value={opt}>{opt}</option>
                ))}
              </select>
            </Help>
            <Slicer
              min={0.25}
              max={4.0}
              field="tts_speed"
              help={"TTS Speed"}
              {...props}
            />
            <Help help="tts response format" field="AAAAA">
              <label className="">TTS Format</label>
              <select
                className="select select-bordered"
                value={props.chatStore.tts_format}
                onChange={(event: any) => {
                  const format = event.target.value as string;
                  props.chatStore.tts_format = format;
                  props.setChatStore({ ...props.chatStore });
                }}
              >
                {TTS_FORMAT.map((opt) => (
                  <option value={opt}>{opt}</option>
                ))}
              </select>
            </Help>
          </div>
          <input
            type="radio"
            name="setting_tab"
            role="tab"
            class="tab"
            aria-label="Image Gen"
          />
          <div
            role="tabpanel"
            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div class="card bg-base-100 w-full shadow-xl">
              <div class="card-body">
                <h2 class="card-title">Image Gen API</h2>
                <p>
                  <Input
                    field="image_gen_key"
                    help="image generation service api key"
                    {...props}
                  />
                  <Input
                    field="image_gen_api"
                    help="DALL image gen key, eg. https://api.openai.com/v1/images/generations"
                    {...props}
                  />
                </p>
                <div class="card-actions justify-end">
                  <SetAPIsTemplate
                    label="Image Gen API"
                    endpoint={props.chatStore.image_gen_api}
                    APIkey={props.chatStore.image_gen_key}
                    tmps={props.templateAPIsImageGen}
                    setTmps={props.setTemplateAPIsImageGen}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 pb-2">
          <p className="text-center">
            chatgpt-api-web ChatStore {Tr("Version")}{" "}
            {props.chatStore.chatgpt_api_web_version}
          </p>
          <p className="text-center">
            {Tr("Documents and source code are avaliable here")}:{" "}
            <a
              className="underline"
              href="https://github.com/heimoshuiyu/chatgpt-api-web"
              target="_blank"
            >
              github.com/heimoshuiyu/chatgpt-api-web
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
