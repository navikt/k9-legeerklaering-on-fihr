export default interface Patient {
    readonly name: string;
    readonly identifier: string;
    readonly birthDate?: Date;
}