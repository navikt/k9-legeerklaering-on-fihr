import { Button, ButtonProps } from "@navikt/ds-react";
import React from "react";
import { Route } from "next";
import NextLink from "next/link";

type NavButtonWithNextHref = ButtonProps & {href: Route};

// NAV aksel component Button as a next link, preserving typechecking of href prop.
const NavNextLinkButton = ({children, ...props}: NavButtonWithNextHref) => <Button as={NextLink} {...props} >{children}</Button>

export default NavNextLinkButton;
