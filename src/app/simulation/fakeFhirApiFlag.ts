
export const sessionStorageKeyName = "fakeFhirApiFlag"

// All fake api implementation names should be defined here
const fakeFhirApiNames = ["fake1"] as const;

export type FakeFhirApiName = typeof fakeFhirApiNames[number];

export const isFakeFhirApiName = (name: string | null): name is FakeFhirApiName => fakeFhirApiNames.includes(name as FakeFhirApiName)

export const getFakeFhirApiName: () => FakeFhirApiName | null = () => {
    const item = sessionStorage.getItem(sessionStorageKeyName)
    if(isFakeFhirApiName(item)) {
        return item
    }
    return null
}
export const setFakeFhirApiName = (name: FakeFhirApiName) => sessionStorage.setItem(sessionStorageKeyName, name)

export const clearFakeFhirApiName = () => sessionStorage.removeItem(sessionStorageKeyName)