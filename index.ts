import { getTronWeb, NILE_USDT_CONTRACT, USER_ADDRESS } from "./config";
import { CalculateResources } from "./src/calculate-resourcers";

const main = async () => {
    await estimateResources();
}

async function estimateResources() {
    const usdtContract = NILE_USDT_CONTRACT;
    if (!usdtContract) {
        throw new Error("Missing usdt contract")
    }
    const tronWeb = getTronWeb();

    const functionSelector = "transfer(address,uint256)";
    const parameters = [
        {
            type: "address",
            value: USER_ADDRESS
        },
        {
            type: "uint256",
            value: tronWeb.toSun(1.198805)
        }
    ];


    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
        usdtContract,
        functionSelector,
        {},
        parameters
    );

    const signedTx = await tronWeb.trx.sign(tx.transaction);

    const calculateResources = new CalculateResources(tronWeb);
    const resources = await calculateResources.getResources(
        usdtContract,
        functionSelector,
        parameters,
        signedTx
    );

    console.log("Estimated Energy: ", resources.estimatedEnergy);
    console.log("Estimated Bandwidth: ", resources.estimatedBandwidth);
    console.log("TRX to Burn: ", resources.trxToBurn);
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});