import MultiDatePeriodInput from "@/app/components/multidateperiod/MultiDatePeriodInput";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import DatePeriod from "@/models/DatePeriod";

describe("MultiDatePeriodInput", () => {
    test("renders empty array value", async () => {
        const onChange = jest.fn()
        const rendered =
            render(<MultiDatePeriodInput value={[]} onChange={onChange} />)

        const addBtn = rendered.getByRole("button", {name: "Legg til ny periode"})
        expect(addBtn).toBeEnabled();
        await userEvent.click(addBtn); expect(onChange).toHaveBeenCalledWith([{}])
    })

    test("renders empty row value and accepts input", async () => {
        const value: DatePeriod[] = [{}]
        const expectedValue1: DatePeriod = {start: new Date("2023-3-12"), end: new Date("2023-3-14")};
        const onChange = jest.fn()
        const rendered =
            render(<MultiDatePeriodInput value={value} onChange={onChange} />)

        const addBtn = rendered.getByRole("button", {name: "Legg til ny periode"})
        expect(addBtn).toBeDisabled(); // Disabled since we now have incomplete input row
        await userEvent.click(addBtn); expect(onChange).not.toHaveBeenCalled()
        // Input start date
        const startInput = rendered.getByLabelText("Fra og med")
        if(startInput === null) throw "startInput not found";
        await userEvent.type(startInput, expectedValue1.start?.toLocaleDateString('no-NO') ?? "");
        // Input end date
        const endInput = rendered.getByLabelText("Til og med")
        if(endInput === null) throw "endInput not found";
        await userEvent.type(endInput, expectedValue1.end?.toLocaleDateString('no-NO') ?? "")

        expect(onChange).toHaveBeenCalledWith([expectedValue1])
    })

    // To match how the DatePicker Input formats its values
    const dateValueFormatter = (dt?: Date): string | undefined => dt?.toLocaleDateString('no-NO', {day: "2-digit", month: "2-digit", year: "numeric"})

    test("renders filled row values and accepts edits to it", async () => {
        const value: DatePeriod[] = [
            {start: new Date("2023-4-1"), end: new Date("2023-4-19")},
            {start: new Date("2023-5-15"), end: new Date("2023-5-20")},
        ]
        const newEnd1 = new Date("2023-4-14")
        const expectedChange1 = [{start: value[0].start, end: undefined}, value[1]]
        const expectedChange2 = [{start: value[0].start, end: newEnd1}, value[1]]
        const onChange = jest.fn();
        const rendered =
            render(<MultiDatePeriodInput value={value} onChange={onChange} />)

        const addBtn = rendered.getByRole("button", {name: "Legg til ny periode"})
        expect(addBtn).toBeEnabled();
        const [endInput1, endInput2] = rendered.queryAllByLabelText("Til og med");
        const [startInput1, startInput2] = rendered.queryAllByLabelText("Fra og med");
        // Check that values are rendered correctly
        expect(startInput1).toHaveValue(dateValueFormatter(value[0]?.start))
        expect(startInput2).toHaveValue(dateValueFormatter(value[1]?.start))
        expect(endInput1).toHaveValue(dateValueFormatter(value[0]?.end));
        expect(endInput2).toHaveValue(dateValueFormatter(value[1]?.end))
        //expect(rendered).toMatchSnapshot() TODO: Fix snapshot

        // Change existing value
        await userEvent.clear(endInput1);
        expect(onChange).toHaveBeenCalledWith(expectedChange1) // First end is now undefined
        await userEvent.type(endInput1, newEnd1.toLocaleDateString('no-NO'));
        expect(onChange).toHaveBeenCalledWith(expectedChange2) // First end is now changed

    })

    test("accepts deleting rows", async () => {
        const value: DatePeriod[] = [
            {start: new Date("2023-4-1"), end: new Date("2023-4-19")},
            {start: new Date("2023-5-15"), end: new Date("2023-5-20")},
        ]
        const expected1 = [{...value[1]}]
        const onChange = jest.fn();
        const rendered =
            render(<MultiDatePeriodInput value={value} onChange={onChange} />)

        const [deleteBtn1] = rendered.getAllByText("Fjern")
        await userEvent.click(deleteBtn1)
        expect(onChange).toHaveBeenCalledWith(expected1)
    })
})
