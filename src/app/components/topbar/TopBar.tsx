import Practitioner from "@/models/Practitioner";
import Image from "next/image";
import { Button, Heading, Popover } from "@navikt/ds-react";
import React, { useEffect, useRef, useState } from "react";
import css from "./TopBar.module.css";
import { ArrowsCirclepathIcon, CaretDownIcon, PersonCircleIcon } from "@navikt/aksel-icons";
import UserListing from "./UserListing";
import { componentSize } from '@/utils/constants';
import NavNextLink from "@/app/components/NavNextLink";
import { InformationSquareIcon } from '@navikt/aksel-icons';
import NavNextLinkButton from "@/app/components/NavNextLinkButton";

export interface UserProps {
    readonly user: Practitioner | undefined;
}

export interface ReloadBtnProps {
    loading: boolean;
    reload(): Promise<void>;
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

const ReloadBtn = ({loading, reload}: ReloadBtnProps) => {
    return <Button
        variant="tertiary-neutral"
        size={componentSize}
        disabled={loading !== false}
        icon={<ArrowsCirclepathIcon aria-hidden />}
        onClick={reload}
    >
        Oppfrisk
    </Button>
}

const AboutLink = () => {
    return <NavNextLinkButton size={componentSize} variant="tertiary-neutral" href="/about" icon={<InformationSquareIcon title="Info om systemet" />}></NavNextLinkButton>
}

const TopNavigation = () => {
    return (
        <div className={css.topnavigation}>
            <Heading level="1" size="small">
                <NavNextLink href="/" variant="neutral" underline={false}>Legeerklæring: Pleiepenger for sykt barn</NavNextLink>
            </Heading>
        </div>
    )
}


// The top header bar always present on the page.
const TopBar = ({user, reload, loading}: TopBarProps) => {
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
            <ReloadBtn reload={reload} loading={loading} />
            <AboutLink />
            <UserPart user={user} />
        </header>
    )
}

export default TopBar;