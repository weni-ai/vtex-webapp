import i18n from '../../../i18n';

export interface WebChatInitConfig {
  inputTextFieldHint?: string;
  startFullScreen?: boolean;
  embedded?: boolean;
  contactTimeout?: number;
  selector: string;
  params?: {
    images?: { dims?: { width?: number; height?: number } };
    storage?: string;
  };
  socketUrl?: string;
  host?: string;
  channelUuid?: string;
  mainColor?: string;
  customizeWidget?: {
    headerBackgroundColor?: string;
    userMessageBubbleColor?: string;
  };
  title?: string;
  subtitle?: string;
  showFullScreenButton?: boolean;
  showCameraRecorder?: boolean;
  showAudioRecorder?: boolean;
  showFileUploader?: boolean;
  mode?: string;
  showMode?: boolean;
  showChatAvatar?: boolean;
  showCloseButton?: boolean;
}

export type WebChatSimulateMessagePayload =
  | { type: 'message'; message: { text?: string; [key: string]: unknown } }
  | { type: 'typing_start'; from: string }
  | { type: 'stream_start'; message: { messageId: string } }
  | { type: 'delta'; seq: number; v: string; message: { messageId: string } }
  | { type: 'stream_end'; message: { messageId: string } };

export interface WebChat {
  init(config: WebChatInitConfig): void;
  open(): void;
  changeLanguage(lang: string): void;
  simulateMessageSent(data: unknown): void;
  simulateMessageReceived(payload: WebChatSimulateMessagePayload): void;
  clear(): void;
  destroy(): void;
  clearPageHistory(): void;
  send(message: string): void;
}

declare global {
  var WebChat: WebChat;
}

export function mountWebchat({
  selector,
  mode = 'live',
  channelUuid = 'fe74b5c2-3046-445b-be84-686ec16787b2',
  title = '',
  subtitle = '',
}: {
  selector: string;
  mode?: 'preview' | 'live';
  channelUuid?: string;
  title?: string;
  subtitle?: string;
}) {
  WebChat.destroy();
  WebChat.init({
    "inputTextFieldHint": "Type a message...",
    "startFullScreen": false,
    "embedded": false,
    "contactTimeout": 0,
    selector,
    "params": {
      "images": {
        "dims": {
          "width": 300,
          "height": 200
        }
      },
      "storage": "session"
    },
    "socketUrl": "https://websocket.weni.ai",
    "host": "https://flows.weni.ai",
    "channelUuid": channelUuid,

    "mainColor": "#3D3D3D",

    "customizeWidget": {
      headerBackgroundColor: '#3D3D3D',
      userMessageBubbleColor: '#3D3D3D',
    },

    title: title,
    subtitle: subtitle,
    showFullScreenButton: false,
    showCameraRecorder: false,
    showAudioRecorder: false,
    showFileUploader: false,

    mode,
    showMode: true,
    showChatAvatar: false,
    showCloseButton: false,
  });

  WebChat.open();
  WebChat.changeLanguage(i18n.language);
  WebChat.clear();
}

export function getTextByUseCase(useCase: string, text: string) {
  return i18n.t(`onboarding.onboard_setup.use_cases.${useCase}.preview.${text}`);
}

/** Incremented on start() and stop(); any run with runId < currentRunId is cancelled. */
let currentRunId = 0;

async function runStep(
  steps: any[],
  stepIndex: number,
  runId: number
): Promise<void> {
  if (runId !== currentRunId) return;

  WebChat.open();

  const step = steps[stepIndex];
  if (!step) return;

  if (step.type === 'sent') {
    WebChat.simulateMessageSent(step.data);
  } else if (step.type === 'received') {
    if (typeof step.data === 'string') {
      WebChat.simulateMessageReceived({
        type: 'message',
        message: {
          text: step.data,
        },
      });
    } else if (typeof step.data === 'object') {
      WebChat.simulateMessageReceived({ type: 'message', message: step.data });
    }
  } else if (step.type === 'streaming-received') {
    await simulateStreaming(step.data, runId);
    if (runId !== currentRunId) return;
  } else if (step.type === 'typing') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (runId !== currentRunId) return;
    WebChat.simulateMessageReceived({
      type: 'typing_start',
      from: 'ai-assistant',
    });
  } else if (step.type === 'delay') {
    await new Promise((resolve) => setTimeout(resolve, step.data));
    if (runId !== currentRunId) return;
  } else if (step.type === 'animate') {
    await step.function();
    if (runId !== currentRunId) return;
  }

  if (runId !== currentRunId) return;
  if (stepIndex + 1 < steps.length) {
    runStep(steps, stepIndex + 1, runId);
  }
}

export function start(steps: any[]): { stop: () => void } {
  currentRunId += 1;
  cursor.remove();
  const runId = currentRunId;

  WebChat.clearPageHistory();
  WebChat.clear();
  runStep(steps, 0, runId);

  return {
    stop: () => {
      currentRunId += 1;
      cursor.remove();
    },
  };
}

export async function simulateStreaming(
  text: string,
  runId?: number
): Promise<void> {
  const messageId = Math.random().toString(36).substring(2, 15);

  let missingText = text;
  const chunks: { seq: number; text: string; delay: number }[] = [];

  while (missingText.length > 0) {
    const chunk = missingText.slice(0, Math.floor(Math.random() * 7) + 1);
    missingText = missingText.slice(chunk.length);
    chunks.push({
      seq: chunks.length + 1,
      text: chunk,
      delay: Math.floor(Math.random() * 100) + 10,
    });
  }

  WebChat.simulateMessageReceived({
    type: 'stream_start',
    message: { messageId },
  });

  for (const chunk of chunks) {
    if (runId !== undefined && runId !== currentRunId) return;
    await new Promise((resolve) => setTimeout(resolve, chunk.delay));
    if (runId !== undefined && runId !== currentRunId) return;

    WebChat.simulateMessageReceived({
      type: 'delta',
      seq: chunk.seq,
      v: chunk.text,
      message: { messageId },
    });
  }

  if (runId !== undefined && runId !== currentRunId) return;
  WebChat.simulateMessageReceived({
    type: 'stream_end',
    message: { messageId },
  });
}

export const cursor = {
  current: null as HTMLElement | null,

  create: async (target: HTMLElement | null) => {
    if (!target) return;

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" height="32px" width="32px" viewBox="0 -960 960 960" fill="#3D3D3D" stroke="#FFFFFF"><path d="M80-480v-80h120v80H80Zm136 222-56-58 84-84 58 56-86 86Zm28-382-84-84 56-58 86 86-58 56Zm476 480L530-350l-50 150-120-400 400 120-148 52 188 188-80 80ZM400-720v-120h80v120h-80Zm236 80-58-56 86-86 56 56-84 86Z"/></svg>`;

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    svgElement.style.position = 'fixed';
    svgElement.style.zIndex = '10000';
    svgElement.style.transition = 'all 1s ease';

    document.body.appendChild(svgElement);

    cursor.current = svgElement;

    cursor.move(target);

    cursor.animate([
      { transform: 'scale(0)' },
      { transform: 'scale(1)' }
    ], {
      duration: 400,
      fill: 'forwards'
    });
  },

  remove: async () => {
    if (!cursor.current) return;

    cursor.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0)' }
    ], {
      duration: 400,
      fill: 'forwards'
    });

    await new Promise(resolve => setTimeout(resolve, 400));

    cursor.current.parentElement?.removeChild(cursor.current);
    cursor.current = null;
  },

  move: (element: HTMLElement) => {
    if (!cursor.current) return;

    const { left, top, width, height } = element.getBoundingClientRect();
    cursor.current.style.left = `${left + width / 2 - 16}px`;
    cursor.current.style.top = `${top + height / 2 - 16}px`;
  },

  click: async (element: HTMLElement | null) => {
    if (!cursor.current || !element) return;

    cursor.current.style.transform = 'scale(0.5)';

    cursor.current.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0.8)' },
      { transform: 'scale(1)' }
    ], {
      duration: 200,
      fill: 'forwards'
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    element.click();
  },

  moveAndClick: async (element: HTMLElement | null) => {
    if (!element) return;

    cursor.move(element);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await cursor.click(element);
  },

  animate: async (...args: Parameters<Animatable["animate"]>) => {
    if (!cursor.current) return;

    cursor.current.animate(...args);
  },
}
