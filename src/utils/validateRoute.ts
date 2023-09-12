import {Route} from "next";

/**
 * This is lets us have compile-time checking of route paths with the new "statically typed links" feature.
 * https://nextjs.org/docs/app/building-your-application/configuring/typescript#statically-typed-links
 */
const validateRoute = <T extends string>(route: Route<T>): string => route

export default validateRoute