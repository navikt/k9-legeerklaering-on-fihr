"use client";

import { signIn, signOut, useSession } from "next-auth/react"
import { Button, Dropdown, InternalHeader } from '@navikt/ds-react';
import Link from 'next/link';

export default function Header() {
    const {data: session, status} = useSession()
    const loading = status === "loading"

    return (
        <header>
            <InternalHeader className="flex justify-between">
                <InternalHeader.Title as="h1">Legeerklæring - pleiepenger sykt barn</InternalHeader.Title>
                {!session && (
                    <>
                        <Link
                            href={`/api/auth/signin`}
                            passHref
                            className="ml-auto"
                            onClick={(e) => {
                                e.preventDefault()
                                signIn()
                                    .then((r) => console.log(r))
                                    .catch((err) => console.log(err))
                            }}
                        >
                            <Button>Sign in</Button>
                        </Link>
                    </>
                )}
                {session?.user && (
                    <Dropdown>
                        <InternalHeader.UserButton
                            as={Dropdown.Toggle}
                            name={session.user.email ?? session.user.name ?? "Ukjent"}
                            className="ml-auto"
                        />
                        <Dropdown.Menu>
                            <Dropdown.Menu.List>
                                <Dropdown.Menu.List.Item>
                                    <Link
                                        href={`/api/auth/signout`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            signOut()
                                        }}>Logg ut</Link>
                                </Dropdown.Menu.List.Item>
                            </Dropdown.Menu.List>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </InternalHeader>
        </header>
    )
}
