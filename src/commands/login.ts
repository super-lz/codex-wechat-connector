import { log } from "../logger.js";
import { startWechatLogin, waitForWechatLogin } from "../wechat/auth.js";

export async function runLoginCommand(): Promise<void> {
  const qr = await startWechatLogin();
  const credentials = await waitForWechatLogin({ qrcode: qr.qrcode });
  log("wechat-auth", `login confirmed for ${credentials.accountId ?? "unknown-account"}`);
}
