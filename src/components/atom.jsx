import {atomWithHash} from "jotai/utils"

export const searchQueryAtom = atomWithHash("search-query", { location: 'posts', limit: 2, isTagged: false, tag: null });
export const signInPoputAtom = atomWithHash("sing-in-pop", false, {
    replaceState: true
});