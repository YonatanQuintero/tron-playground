import { getTronWeb, NILE_USDT_CONTRACT, USER_ADDRESS } from "./config";
import { CalculateResources } from "./src/calculate-resources";
import { estimateResources } from "./src/v2/estimate-resources";
import { resourcesDelegation } from "./src/v2/resources-delegation";
import { sendUsdt } from "./src/send-usdt";

const main = async () => {
    await estimateResources();
    // await sendUsdt();
    // await resourcesDelegation();
}


main().catch(error => {
    console.error(error);
    process.exit(1);
});