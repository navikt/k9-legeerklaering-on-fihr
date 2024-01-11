export default interface Patient {
    readonly name: string;
    readonly ehrId: string;
    readonly fnr: string | null;
    readonly birthDate?: Date;
}