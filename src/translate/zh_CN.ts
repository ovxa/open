const LANG_MAP: Record<string, string> = {
  settings: "设置",
  model: "助手",
  "copy setting link": "复制设置链接",
  "are you sure to clear all history?": "清除所有记录，是否确认？",
  "clear history": "清除记录",
  new: "新话题",
  del: "消失",
  cut: "忽略",
  "please click above to set": "请点击上方进行设置",
  cost: "成本",
  stream: "动态回复",
  fetch: "静态回复",
  Tools: "工具",
  Clear: "清空",
  "saved api templates": "已保存的 API 脚本",
  "saved prompt templates": "已保存的提示自动回复",
  "no chat history here": "暂无聊天记录",
  "This is a new chat session, start by typing a message":
    "这是一个新聊天，开始输入消息",
  "Settings button located at the top right corner can be used to change the settings of this chat":
    "右上角的设置按钮可用于更改此聊天的设置",
  "'New' button located at the top left corner can be used to create a new chat":
    "左上角的 '新' 按钮可用于创建新聊天",
  "click above to change the settings of this chat":
    "点击上方更改此聊天的参数",
  "click the NEW to create a new chat": "点击左上角 NEW 新建聊天",
  "all chat history and settings are stored in the local browser":
    "所有聊天保存在浏览器本地",
  "documents and source code are avaliable here":
    "详细文档与源代码可在此处获取",
  "generating...": "思考中，请保持网络稳定...",
  "re-generate": "重新思考",
  completion: "补全",
  "generated by": "思考助手: ",
  "info: chat history is too long, forget messages":
    "提示：聊天太长超过了套餐限制，忽略了更早的内容",
  "warning: current chatstore version": "提示：聊天版本",
  retry: "重试",
  send: "发送",
  assistant: "助手消息",
  user: "用户消息",
  close: "关闭",
  "message copied to clipboard": "消息已复制",
  "total cost in this session": "本次会话总成本",
  "accumulated cost in all sessions": "所有会话总成本",
  export: "导出",
  "give this template a name:": "给此自动回复命名：",
  "no template name specified": "未指定自动回复名称",
  "as template": "保存为会话自动回复",
  "as api template": "保存为 API 脚本",
  "this will overwrite the current chat history! continue?":
    "将覆盖聊天！是否继续？",
  "please select a json file": "请选择一个 JSON 文件",
  "empty file": "提示: 空文件",
  "this is not an exported ai chatstore file. the version is missing!":
    "此文件不符合要求，请检查是否正确",
  "import error on parsing json": "解析错误",
  version: "版本",
  "copied link:": "已复制：",
  reset: "重新开始",
  example: "示例",
  render: "渲染",
  "reset current": "清空聊天",
  "send message": "发送",
  "type your message here...": "在此输入消息...",
  "total tokens": "总token数",
  "session cost": "本会话成本",
  "accumulated cost": "累计成本",
  session: "会话",
  "you can customize all the settings here": "您可以在此处自定义所有设置",
  "Image Gen API": "图片生成 API",
  "Image generation API endpoint. Service is enabled when this is set. Default: https://api.openai.com/v1/images/generations":
    "图片生成 API 端点。设置后服务将启用。默认: https://api.openai.com/v1/images/generations",
  "Image generation service API key. Defaults to the OpenAI key above, but can be configured separately here":
    "图片生成服务 API 密钥。默认为上面的 OpenAI 密钥，但可以在此处单独配置",
  "Adjust the playback speed of text-to-speech": "调整文本转语音的播放速度",
  "TTS API endpoint. Service is enabled when this is set. Default: https://api.openai.com/v1/audio/speech":
    "TTS API 端点。设置后服务将启用。默认: https://api.openai.com/v1/audio/speech",
  "Text-to-speech service API key. Defaults to the OpenAI key above, but can be configured separately here":
    "文本转语音服务 API 密钥。默认为上面的 OpenAI 密钥，但可以在此处单独配置",
  "Whisper speech-to-text service. Service is enabled when this is set. Default: https://api.openai.com/v1/audio/transriptions":
    "Whisper 语音转文本服务。设置后服务将启用。默认: https://api.openai.com/v1/audio/transriptions",
  "Used for Whisper service. Defaults to the OpenAI key above, but can be configured separately here":
    "用于 Whisper 服务。默认为上面的 OpenAI 密钥，但可以在此处单独配置",
  "Frequency Penalty": "频率惩罚",
  "Presence Penalty": "存在惩罚",
  "Top P sampling method. It is recommended to choose one of the temperature sampling methods, do not enable both at the same time.":
    "Top P 采样方法。建议选择其中一种温度采样方法，不要同时启用两种。",
  "Total token count, this parameter will be updated every time you chat, in stream mode this parameter is an estimate":
    "总 token 数，此参数将在每次聊天时更新，在流式模式下此参数是一个估计",
  "Indicates how many history messages to 'forget' when sending API requests":
    "发送 API 请求时遗忘多少历史消息",
  'When totalTokens > maxTokens - tokenMargin, the history message will be truncated, assistant will "forget" part of the messages in the conversation (but all history messages are still saved locally)':
    "当 totalTokens > maxTokens - tokenMargin 时，历史消息将被截断，assistant 将“遗忘”聊天中的部分消息（但所有历史消息仍然在本地保存）",
  "maxGenTokens is the maximum number of tokens that can be generated in a scingle request.":
    "maxGenTokens 是一次请求中可以思考的最大 token 数。",
  "Logprobs, return the probability of each token":
    "Logprobs，返回每个 token 的概率",
  "Stream Mode, use stream mode to see the generated content dynamically, but the token count cannot be accurately calculated, which may cause too much or too little history messages to be truncated when the token count is too large.":
    "流式模式，使用流式模式动态查看思考的内容，但无法准确计算 token 数，当 token 数过大时可能导致截断过多或过少的历史消息。",
  "Temperature, the higher the value, the higher the randomness of the generated text.":
    "温度，值越高，思考文本的随机性越高。",
  "Model, Different models have different performance and pricing, please refer to the API documentation":
    "模型，不同的模型具有不同的性能和定价，请参考 API 文档",
  "Chat API": "聊天 API",
  "API endpoint, useful for using reverse proxy services in unsupported regions, default to https://api.openai.com/v1/chat/completions":
    "API 端点，用于在不受支持的地区使用反向代理服务，默认为 https://api.openai.com/v1/chat/completions",
  "OpenAI API key, do not leak this key": "OpenAI API 密钥，请勿泄漏",
  "Select language": "选择语言",
  "Develop Mode, enable to show more options and features":
    "开发者模式，启用以显示更多选项和功能",
  "Saved Template": "已保存模板",
  "Image Generation": "图片生成",
  TTS: "文本转语音",
  "Speech Recognition": "语音识别",
  System: "系统",
  "Max context token count. This value will be set automatically based on the selected model.":
    "最大上下文 token 数。此值将根据所选模型自动设置。",
  chat: "聊天",
  save: "保存",
  "Configure speech recognition settings": "配置语音识别设置",
  "Whisper API": "Whisper API",
  Custom: "自定义",
  "Configure the LLM API settings": "配置 LLM API 设置",
  "TTS Voice": "TTS 语音",
  "TTS Format": "TTS 格式",
  Formats: "格式",
  "TTS API": "TTS API",
  "Configure text-to-speech settings": "配置文本转语音设置",
  Voices: "语音",
  "in all sessions": "所有会话",
  "Reset Total Cost": "重置总成本",
  Language: "语言",
  "Quick Actions": "快速操作",
  Import: "导入",
  Languages: "语言",
  "maxGenTokens is the maximum number of tokens that can be generated in a single request.":
    "maxGenTokens 是一次请求中可以思考的最大 token 数。",
  "Image Generation API": "图片生成 API",
  "Configure image generation settings": "配置图片生成设置",
  "New Chat": "新聊天",
  "Delete Chat": "删除聊天",
  "removed from context": "已从上下文中移除",
  follow: "跟随",
  "stop generating": "停止思考",
};

export default LANG_MAP;
