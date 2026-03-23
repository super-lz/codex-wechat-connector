import { writeAudit } from "../audit.js";
import { sendFileFromPath, sendImageFromPath } from "../wechat/media.js";
import { WechatApiClient } from "../wechat/api.js";

export async function executeSendActions(params: {
  api: WechatApiClient;
  senderId: string;
  threadId: string;
  contextToken: string;
  actions: Array<{ type: "image"; path: string } | { type: "file"; path: string }>;
  firstCaption?: string;
}): Promise<{ remainingCaption: string }> {
  let firstCaption = params.firstCaption ?? "";

  for (const action of params.actions) {
    if (action.type === "image") {
      await sendImageFromPath({
        api: params.api,
        filePath: action.path,
        toUserId: params.senderId,
        contextToken: params.contextToken,
        caption: firstCaption
      });
      writeAudit({
        kind: "wechat_image_outbound",
        senderId: params.senderId,
        threadId: params.threadId,
        detail: action.path,
        ok: true
      });
    } else {
      await sendFileFromPath({
        api: params.api,
        filePath: action.path,
        toUserId: params.senderId,
        contextToken: params.contextToken,
        caption: firstCaption
      });
      writeAudit({
        kind: "wechat_file_outbound",
        senderId: params.senderId,
        threadId: params.threadId,
        detail: action.path,
        ok: true
      });
    }
    firstCaption = "";
  }

  return { remainingCaption: firstCaption };
}
