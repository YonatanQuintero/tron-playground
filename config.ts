import * as dotenv from "dotenv";
import { TronWeb } from "tronweb";

dotenv.config();

export const TRON_ADDRESS = process.env.TRON_ADDRESS;
export const TRON_PRIVATE_KEY = process.env.TRON_PRIVATE_KEY;
export const TRON_API_KEY = process.env.TRON_API_KEY;
export const NILE_USDT_CONTRACT = process.env.NILE_USDT_CONTRACT;
export const USER_ADDRESS = process.env.USER_ADDRESS;
export const USER_PRIVATE_KEY = process.env.USER_PRIVATE_KEY;

export const getTronWeb = (): TronWeb => {
    return new TronWeb({
        fullHost: "https://nile.trongrid.io",
        privateKey: TRON_PRIVATE_KEY,
        headers: { "TRON-PRO-API-KEY": TRON_API_KEY }
    });
}
