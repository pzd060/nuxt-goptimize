import Cookies from "js-cookie";
const COOKIE_PREFIX = "gopt";
const EVENT_HANDLER = "<%= options.eventHandler %>";
const EXPERIMENTS = require("<%= options.experiments %>");
const reported = [];
function weightedRandom(weights) {
    var totalWeight = 0, i, random;
    for (i = 0; i < weights.length; i++) {
        totalWeight += weights[i];
    }
    random = Math.random() * totalWeight;
    for (i = 0; i < weights.length; i++) {
        if (random < weights[i]) {
            return i.toString();
        }
        random -= weights[i];
    }
    return "";
}
export function experimentVariant(experimentName, forceVariant) {
    const experiment = EXPERIMENTS.find((exp) => exp.name === experimentName);
    if (experiment === undefined) {
        return 0;
    }
    const key = `${COOKIE_PREFIX}_${experimentName}`;
    // Force a specific variant by url or param
    const forceVariantByUrl = window.$nuxt.$route.query[key];
    const variant = forceVariantByUrl ?? forceVariant?.toString() ?? undefined;
    if (variant) {
        Cookies.set(key, variant, {
            expires: experiment.maxAgeDays,
        });
    }
    // Determine the active variant of the experiment
    let activeVariant = Cookies.get(key) || "";
    if (activeVariant.length === 0) {
        const weights = experiment.variants.map((weight) => weight === undefined ? 1 : weight);
        let retries = experiment.variants.length;
        while (activeVariant === "" && retries-- > 0) {
            activeVariant = weightedRandom(weights);
        }
        Cookies.set(key, activeVariant, {
            expires: experiment.maxAgeDays,
        });
    }
    // Let Google know about the active experiment's variant
    if (reported.indexOf(experimentName) === -1) {
        if (EVENT_HANDLER === "ga" && window.ga) {
            window.ga("set", "exp", `${experiment.id}.${activeVariant}`);
            window.ga("send", "pageview");
            reported.push(experimentName);
        }
        else if (EVENT_HANDLER === "dataLayer" && window.dataLayer) {
            window.dataLayer.push({
                "ExperimentId": experiment.id,
                "VariationId": activeVariant,
                "EXP1": `${experiment.id}.${activeVariant}`,
            });
            reported.push(experimentName);
        }
    }
    return Number.parseInt(activeVariant);
}
const googleOptimizePlugin = (ctx, inject) => {
    inject("gexp", experimentVariant);
};
export default googleOptimizePlugin;
//# sourceMappingURL=plugin.js.map