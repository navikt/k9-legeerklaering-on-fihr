import { LinkPanel } from "@navikt/ds-react";
import NextLink from "next/link";
import React from "react";
import { NavLinkWithNextHref } from "@/app/components/NavNextLink";

// NAV aksel component LinkPanel as a next link, preserving typechecking of href prop.
const NavNextLinkPanel = ({children, ...props}: NavLinkWithNextHref) => <LinkPanel as={NextLink} {...props} >{children}</LinkPanel>

export default NavNextLinkPanel;
