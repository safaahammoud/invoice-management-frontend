export type FetchAllInvoicesQuery = {
    page?: number;
    search?: string;
    itemsPerPage?: number;
}

export type Invoice = {
    number: string;
    dateIssued: string;
    dueDate: string;
    status: string;
    amount: number;
    currencySymbol: string;
}