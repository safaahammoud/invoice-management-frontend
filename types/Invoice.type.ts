export type Invoice = {
    number: string;
    dateIssued: string;
    dueDate: string;
    status: string;
    amount: number;
    currencySymbol: string;
    note?: string;
}