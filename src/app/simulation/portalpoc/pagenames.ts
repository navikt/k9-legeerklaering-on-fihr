import { Route } from "next";


// This creates an object type where all defined routes are keys to a string. So that the pagenames const below
// gets compile time correctness checking for route keys
type PagenameMapping = {
    readonly [key in Route<never>]: string;
}

// XXX When we're not just prototyping anymore we should remove the Partial around here, which will force us to specify
// pagenames  for all static routes, so that we don't miss any
const pagenames: Partial<PagenameMapping> = {
    "/simulation/portalpoc": "Simulering",
    "/simulation/portalpoc/about": "Om løsningen",
    "/simulation/portalpoc/legeerklaering-pleiepenger-sykt-barn": "Legeerklæring - Pleiepenger sykt barn",
    "/simulation/portalpoc/legeerklaering-pleiepenger-sykt-barn/about": "Om Legeerklæringen",
    "/simulation/portalpoc/legeerklaering-pleiepenger-sykt-barn/new": "Opprett ny",
}

export const pagename = (route: Route<any>): string | undefined => pagenames[route]