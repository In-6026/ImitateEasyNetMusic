import { ActionTree, GetterTree, ModuleTree, MutationTree } from "vuex";
export default interface StoreOptions<S> {
    state?: S | (() => S)
    getters?: GetterTree<S, S>
    actions?: ActionTree<S, S>
    mutations?: MutationTree<S>
    modules?: ModuleTree<S>
    strict?: boolean
    devtools?: boolean
}