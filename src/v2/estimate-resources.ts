import { DEFAULT_USDT_CONTRACT, USER_ADDRESS } from "../../config";
import { TheterService } from "../services/theter.service";
import { TronWebService } from "../services/tron-web.service";
import { TronService } from "../services/tron.service";

export const estimateResources = async () => {

    const {
        usdtContract,
        userAddress
    } = validateAndRetrieveConfig();

    const tronWeb = await TronWebService.create();
    await TronWebService.checkConnection(tronWeb);
    const tronService = new TronService(tronWeb);
    const theterService = new TheterService(tronService, usdtContract);
    const callerAddress = tronWeb.defaultAddress.base58;

    if (!callerAddress) {
        throw new Error("Failed to get caller address");
    }

    const callerBalance = await theterService.getBalanceInDecimal(callerAddress);
    const balanceToSend = 1.1988;

    if (balanceToSend > callerBalance) {
        throw new Error("Insufficient balance");
    }

    const resources = await theterService.getTransferResources(
        userAddress, Number(tronWeb.toSun(balanceToSend))
    );

    console.log("Estimated Energy: ", resources.estimatedEnergy);
    console.log("Estimated Bandwidth: ", resources.estimatedBandwidth);
    console.log("TRX to Burn: ", resources.trxToBurn);
}

type EstimateResourcesConfig = {
    usdtContract: string;
    userAddress: string;
};

const validateAndRetrieveConfig = (): EstimateResourcesConfig => {

    const usdtContract = DEFAULT_USDT_CONTRACT;
    if (!usdtContract) {
        throw new Error("Missing usdt contract");
    }

    const userAddress = USER_ADDRESS;
    if (!userAddress) {
        throw new Error("Missing user address");
    }

    return { usdtContract, userAddress };
};
