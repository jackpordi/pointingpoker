import Crypto from "crypto";

export function generateRoomId() {
  return Crypto.randomBytes(2).toString("hex").toUpperCase();
}
