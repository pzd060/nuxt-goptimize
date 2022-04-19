import path from "path";
// eslint-disable-next-line
export default function GoogleOptimizeModule() {
    const defaults = {
        experiments: "~/experiments.js",
        eventHandler: "ga",
    };
    const options = Object.assign({}, defaults, this.options.googleOptimize);
    this.addPlugin({
        src: path.resolve(__dirname, "plugin.js"),
        ssr: "false",
        options,
    });
}
//# sourceMappingURL=module.js.map