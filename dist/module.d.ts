import { experimentVariant } from "./plugin";
declare module "vue/types/vue" {
    interface Vue {
        $gexp: typeof experimentVariant;
    }
}
export default function GoogleOptimizeModule(this: any): void;
