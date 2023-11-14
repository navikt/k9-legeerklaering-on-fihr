


import { Link, LinkProps as NavLinkProps } from "@navikt/ds-react";
import NextLink from "next/link";
import React from "react";
import { Route } from "next";

export type NavLinkWithNextHref = NavLinkProps & {href: Route};

// NAV aksel component link as a next link, preserving typechecking of href prop.
const NavNextLink = ({children, ...props}: NavLinkWithNextHref) => <Link as={NextLink} {...props} >{children}</Link>

export default NavNextLink;
