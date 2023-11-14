import Practitioner from "@/models/Practitioner";
import Image from "next/image";
import { Button, Heading, Link, Popover, Tag } from "@navikt/ds-react";
import React, { useEffect, useRef, useState } from "react";
import css from "./TopBar.module.css";
import { ArrowsCirclepathIcon, CaretDownIcon, ChevronRightDoubleIcon, PersonCircleIcon } from "@navikt/aksel-icons";
import { useSelectedLayoutSegments } from "next/navigation";
import NextLink from "next/link";
import validateRoute from "@/utils/validateRoute";
import { pagename } from "./pagenames";
import UserListing from "./UserListing";
import type { BaseApi } from "./BaseApi";

export interface UserProps {
    readonly user: Practitioner | undefined;
}

export interface ReloadBtnProps {
    loading: BaseApi["loading"];
    refreshInitData(): Promise<void>;
}

export interface TopBarProps extends UserProps, ReloadBtnProps {
}

const UserPart = ({user}: UserProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [openState, setOpenState] = useState(false);
    const handleClick = () => {
        setOpenState(!openState)
    }

    // <Label className={css.name}>{user?.name}</Label>
    // <Label className={css.hpr} size="small" textColor="subtle">HPR: {user?.hprNumber}</Label>

    return <>
        <button ref={buttonRef} onClick={handleClick} className={css.usersummary}>
            <PersonCircleIcon title="" fontSize="30px" className={css.avatar} />
            <CaretDownIcon className={css.downer} title="Vis brukerprofil" fontSize="30px" />
        </button>
        <Popover open={openState} onClose={() => setOpenState(false)} anchorEl={buttonRef.current}>
            <Popover.Content>
                <UserListing user={user} />
            </Popover.Content>
        </Popover>
    </> ;
}

const ReloadBtn = ({loading, refreshInitData}: ReloadBtnProps) => {
    return <Button
        variant="tertiary-neutral"
        size="small"
        disabled={loading !== false}
        icon={<ArrowsCirclepathIcon aria-hidden />}
        onClick={refreshInitData}
    >
        Oppfrisk
    </Button>
}

// The url of this layout
const baseUrl = validateRoute("/alt/portalpoc")

const TopNavigation = () => {
    const segments = useSelectedLayoutSegments()

    let segmentUrl = baseUrl
    return (
        <div className={css.topnavigation}>
            <Heading level="1" size="small">
                {
                    segments.length === 0 ? // We're on top level, don't show as link
                        "NAV sykehusintegrasjon" :
                        <Link as={NextLink} underline={false} variant="neutral" href={baseUrl}>NAV sykehusintegrasjon</Link>
                }
                {/*NAV sykehusintegrasjon*/}
            </Heading>
            <Tag variant="warning-moderate" size="xsmall" className={css.beta}>Beta</Tag>
            {
                segments.map((segment, idx) => {
                    segmentUrl = `${segmentUrl}/${segment}`;
                    return <div key={`bc${idx}`} style={{display: "contents"}}>
                        <ChevronRightDoubleIcon aria-hidden />
                        <Heading level="2" size="small">
                            {
                                idx === segments.length - 1 ? // this is the last segment, don't show as link
                                    pagename(segmentUrl) || segment :
                                    <Link as={NextLink} underline={false} variant="neutral" href={segmentUrl}>{pagename(segmentUrl) || segment}</Link>
                            }
                        </Heading>
                    </div>
                })
            }
        </div>
    )
}


// The top header bar always present on the page.
const TopBar = ({user, refreshInitData, loading}: TopBarProps) => {
    const [classNames, setClassNames] = useState([css.bar])

    useEffect(() => {
        const onScroll = () => {
            if(window.scrollY > 10) {
                if(!classNames.includes(css.bottombordered)) {
                    setClassNames([...classNames, css.bottombordered])
                }
            } else if(classNames.includes(css.bottombordered)) {
                setClassNames(classNames.filter(cn => cn !== css.bottombordered))
            }
        }
        document.addEventListener("scroll", onScroll)
        return () => {
            document.removeEventListener("scroll", onScroll)
        }
    }, [classNames, setClassNames])

    const classNameStr = classNames.join(" ")


    return (
        <header className={classNameStr}>
            <Image src="/nav-logo-red.svg" alt="Nav" width={64} height={64} className={css.navlogo} />
            <TopNavigation />
            <div className={css.spacer}/>
            <ReloadBtn refreshInitData={refreshInitData} loading={loading} />
            <UserPart user={user} />
        </header>
    )
}

export default TopBar;