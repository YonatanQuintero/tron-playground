import { estimateResources } from "./src/v2/estimate-resources";
import { resourcesDelegation } from "./src/v2/resources-delegation";
import { sendUsdt } from "./src/v2/send-usdt";

const main = async () => {
     await estimateResources();
    // await sendUsdt();
    // await resourcesDelegation();
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});