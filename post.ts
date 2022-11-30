/// <reference no-default-lib="true"/>
/// <reference lib="es2022"/>

import {
  makeSocket,
  patch,
  Socket,
} from "https://raw.githubusercontent.com/takker99/scrapbox-userscript-std/0.14.10/mod.ts";
import { Line } from "https://raw.githubusercontent.com/takker99/scrapbox-userscript-std/0.14.10/deps/scrapbox-rest.ts";

/** 前回使用したSocket（未使用の場合はundefined） */
let beforeSocket: Socket | undefined = undefined;

export interface TextData {
  text: string[];
  /** Dateオブジェクト、またはミリ秒単位のUnixTime */
  title?: string;
}

export async function postText(
  addText: TextData,
  projectName: string,
  pageTitle: string,
  socket?: Socket,
) {
  const title = (addText.title === undefined ? "" : addText.title);
  const addTextStrings: string[] = [
    ">" + title,
  ];
  for (const text of addText.text) {
    for (const lineText of text.split(/\n/g)) {
      addTextStrings.push(lineText);
    }
  }
  addTextStrings.push(""); // 空行を挿入する

  const updateSocket: Socket = await connectWebSocket(socket);

  const update = (lines: Line[]) => {
    const texts: string[] = [lines[0].text, ...addTextStrings];
    for (const line of lines.slice(1)) {
      texts.push(line.text);
    }
    return texts;
  };
  patch(
    projectName,
    pageTitle,
    update,
    {
      socket: updateSocket,
    },
  );
}

/**
 * WebSocketの接続を開始します。 \
 * 接続以降は自動的にそのソケットを使用します。
 *
 * @param {Socket} [socket] 使用するsocket（指定しない場合は自動的に接続を開始します）
 */
export async function connectWebSocket(socket?: Socket): Promise<Socket> {
  if (socket !== undefined) {
    beforeSocket = socket;
  } else if (beforeSocket === undefined) {
    beforeSocket = await makeSocket();
  }
  return beforeSocket;
}
