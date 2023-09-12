import DatePeriod, {datePeriod, datePeriodsEqual} from "@/models/DatePeriod";
import {ReactNode, Ref, useEffect, useRef} from "react";
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
    /**
     * startInputRef is so that the MultiDatePeriodInput can focus the start input of new added inputs. To improve UX.
     */
    readonly startInputRef?: Ref<HTMLInputElement>;
}

export const DatePeriodInput = ({value, onChange, error, actionSlot, hideLabel = false, startInputRef}: DatePeriodInputProps) => {
    const {datepickerProps, fromInputProps, toInputProps, selectedRange} = useRangeDatepicker({
        defaultSelected: value && {from: value?.start, to: value?.end},
        onRangeChange: (range) => {
            // Only emit change when new value is different from old
            const newValue = range !== undefined ? datePeriod(range.from, range.to) : undefined;
            if (!datePeriodsEqual(value, newValue)) {
                onChange(newValue)
            }
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
                    ref={startInputRef}
                />
                <DatePicker.Input
                    {...toInputProps}
                    label="Til og med"
                    hideLabel={hideLabel}
                    className={css.endInput}
                />
                <div className={css.description}>
                    {error ? <ErrorMessager error={error} /> : <BodyShort>{ summary }</BodyShort> }
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
    /**
     * valueErrors is for mapping error messages to a row in value array, so that an error related to one of the value
     * elements appears on the input of that element. Must match the indexes of the value array.
     */
    readonly valueErrors?: (string | undefined)[];
}

export default function MultiDatePeriodInput({value, onChange, className, error, valueErrors}: MultiDatePeriodInputProps) {
    // When a period has been added to value, we want to focus the start date input of the added period
    const prevValue = useRef(value);
    const lastStartInputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (value.length > prevValue.current.length) {
            lastStartInputRef?.current?.focus()
        }
        prevValue.current = value;
    }, [value])

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

    const handleAdd = () => {
        onChange([...value, {}]);
    }

    return (
        <div className={`navds-form-field ${css.multiwrapper} ${className}`}>
            { value.map((datePeriod, idx) => {
                return (
                    <DatePeriodInput
                        key={`dpi-${value.length}-${idx}`}
                        hideLabel={idx > 0}
                        value={datePeriod}
                        onChange={(changed) => handleChange(datePeriod, changed)}
                        actionSlot={<Button onClick={() => handleDelete(idx)} size="small" variant="secondary" icon={<TrashIcon />}>Fjern</Button>}
                        startInputRef={idx === value.length - 1 ? lastStartInputRef : undefined}
                        error={valueErrors?.[idx]}
                    />
                )
            }) }
            <Button
                className={css.addbutton}
                disabled={hasIncompleteValue}
                onClick={handleAdd}
                size="small"
                variant="secondary"
                icon={<PlusIcon />}>
                Legg til
            </Button>
            <ErrorMessager error={error} />
        </div>
    )
}