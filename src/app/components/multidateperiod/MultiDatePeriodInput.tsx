import DatePeriod, {datePeriod} from "@/models/DatePeriod";
import {ReactNode} from "react";
import {BodyShort, Button, DatePicker, useRangeDatepicker} from "@navikt/ds-react";

import css from './multidateperiod.module.css';
import {addOneDay, dayCount} from "@/utils/datecalc";
import ErrorMessager from "@/app/components/diagnosekoder/ErrorMessager";
import {PlusIcon, TrashIcon} from "@navikt/aksel-icons";

export interface DatePeriodInputProps {
    readonly value: DatePeriod | undefined;
    readonly onChange: (datePeriod: DatePeriod | undefined) => void;
    readonly error?: string;
    readonly actionSlot?: ReactNode;
    readonly hideLabel?: boolean;
}

export const DatePeriodInput = ({value, onChange, error, actionSlot, hideLabel = false}: DatePeriodInputProps) => {
    const {datepickerProps, fromInputProps, toInputProps, selectedRange} = useRangeDatepicker({
        defaultSelected: value && {from: value?.start, to: value?.end},
        onRangeChange: (range) => {
            onChange(range !== undefined ? datePeriod(range.from, range.to) : undefined)
        },
        allowTwoDigitYear: false,
        openOnFocus: false,
    });
    const selectedDayCount = dayCount(selectedRange?.from, addOneDay(selectedRange?.to))
    const summary = selectedDayCount === 1 ? `= ${selectedDayCount} dag` : (selectedDayCount > 0 ? `= ${selectedDayCount} dager` : undefined);
    return (
        <DatePicker {...datepickerProps} wrapperClassName={css.wrapper}>
            <div className={css.inputwrapper}>
                <DatePicker.Input
                    {...fromInputProps}
                    label="Fra og med"
                    hideLabel={hideLabel}
                    className={css.startInput}
                />
                <DatePicker.Input
                    {...toInputProps}
                    label="Til og med"
                    hideLabel={hideLabel}
                    className={css.endInput}
                />
                <div className={css.description}>
                    <BodyShort>{ error || summary}</BodyShort>
                </div>
                <div className={css.actions}>
                    {actionSlot}
                </div>
            </div>
        </DatePicker>
    )
}

export interface MultiDatePeriodInputProps {
    readonly value: DatePeriod[];
    readonly onChange: (periods: DatePeriod[]) => void;
    readonly className?: string;
    readonly error?: ReactNode;
}

export default function MultiDatePeriodInput({value, onChange, className, error}: MultiDatePeriodInputProps) {
    const handleChange = (beforeChange: DatePeriod, afterChange: DatePeriod | undefined) => {
        if (afterChange !== undefined) {
            // Make a copy of value with the DatePeriod object from before change replaced with the object afterChange
            const newValue = value.map(dp => dp === beforeChange ? afterChange : dp)
            // Emit the new value
            onChange(newValue)
        }
    }
    const handleDelete = (deleteIdx: number) => {
        const newValue = value.filter((datePeriod, idx) => idx !== deleteIdx);
        onChange(newValue)
    }
    // If some value is incomplete, we disable the add button
    const hasIncompleteValue = value.some(dp => dp.start === undefined || dp.end === undefined)

    return (
        <div className={`navds-form-field ${css.multiwrapper} ${className}`}>
            { value.map((datePeriod, idx) => {
                return (
                    <DatePeriodInput
                        key={`dpi-${idx}-${datePeriod.start?.getTime()}-${datePeriod.end?.getTime()}`}
                        hideLabel={idx > 0}
                        value={datePeriod}
                        onChange={(changed) => handleChange(datePeriod, changed)}
                        actionSlot={<Button onClick={() => handleDelete(idx)} size="small" variant="secondary" icon={<TrashIcon />}>Fjern</Button>}
                    />
                )
            }) }
            <Button
                className={css.addbutton}
                disabled={hasIncompleteValue}
                onClick={() => onChange([...value, {}])}
                size="small"
                variant="secondary"
                icon={<PlusIcon />}>
                Legg til
            </Button>
            <ErrorMessager error={error} />
        </div>
    )
}