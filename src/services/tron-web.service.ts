import { TronWeb } from "tronweb";
import { DEFAULT_FULL_HOST, TRON_API_KEY, TRON_PRIVATE_KEY } from "../../config";

export class TronWebService {
    static async create(privateKey?: string, fullHost?: string, tronApiKey?: string): Promise<TronWeb> {
        return new TronWeb({
            fullHost: fullHost || DEFAULT_FULL_HOST,
            privateKey: privateKey || TRON_PRIVATE_KEY,
            headers: { "TRON-PRO-API-KEY": tronApiKey || TRON_API_KEY }
        });
    }

    static async checkConnection(tronWeb: TronWeb): Promise<boolean> {

        const isConnected = await tronWeb.isConnected();

        if (!isConnected.fullNode) {
            console.error('Failed to connect to full node tron network');
            throw new Error('Failed to connect to full node tron network');
        }

        if (!isConnected.solidityNode) {
            console.error('Failed to connect to solidity node tron network');
            throw new Error('Failed to connect to solidity node tron network');
        }

        if (!isConnected.eventServer) {
            console.error('Failed to connect to event server tron network');
            throw new Error('Failed to connect to event server tron network');
        }

        console.log(`Tron Full node is connected`)
        console.log(`Tron Solidity node is connected`)
        console.log(`Tron Event server is connected`)
        console.log(`Connected to ${tronWeb.fullNode} (${tronWeb.version})`);

        return true;
    }

}