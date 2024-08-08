import { NILE_USDT_CONTRACT, USER_ADDRESS } from "../../config";
import { TheterService } from "../services/theter.service";
import { TronWebService } from "../services/tron-web.service";
import { TronService } from "../services/tron.service";

export const sendUsdt = async (): Promise<void> => {
    const { usdtContract, userAddress } = validateAndRetrieveConfig();

    const tronWeb = await TronWebService.create();
    await TronWebService.checkConnection(tronWeb);
    const tronService = new TronService(tronWeb);
    const theterService = new TheterService(tronService, usdtContract);
    console.log("Sending USDT to user address:", userAddress);
    const broadcastedTx = await theterService.transfer(userAddress, Number(tronWeb.toSun(1.1988)));
    if (!broadcastedTx.result) {
        console.error(broadcastedTx);
        throw new Error("Failed to send transaction");
    }
    const txInfo = await tronService.getTransactionInfo(broadcastedTx.transaction.txID);
    console.log(txInfo);
    console.log("Confirmed:", txInfo?.receipt.result);
}

type SendUsdtConfig = {
    usdtContract: string;
    userAddress: string;
};

const validateAndRetrieveConfig = (): SendUsdtConfig => {

    const usdtContract = NILE_USDT_CONTRACT;
    if (!usdtContract) {
        throw new Error("Missing usdt contract");
    }

    const userAddress = USER_ADDRESS;
    if (!userAddress) {
        throw new Error("Missing user address");
    }

    return { usdtContract, userAddress };
};