import { getTronWeb, NILE_USDT_CONTRACT, USER_ADDRESS } from "./config";
import { CalculateResources } from "./src/calculate-resources";
import { estimateResources } from "./src/estimate-resources";
import { resourcesDelegation } from "./src/resources-delegation";
import { sendUsdt } from "./src/send-usdt";

const main = async () => {
    //  await estimateResources();
    // await resourcesDelegation();
    await sendUsdt();
}


main().catch(error => {
    console.error(error);
    process.exit(1);
});