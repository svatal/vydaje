export interface IRecord {
    sourceAccount: string;
    date: Date;
    amount: number;
    // currency: string;
    targetAccount: string;
    targetBank: string;
    recieversMessage: string;
    note: string;
    type: string;
}

export function toRecords(input: string[][]): IRecord[] {
    return input.map<IRecord>(v => {
        const date = v[1].split('.').map(d => parseInt(d));
        return {
            sourceAccount: v[0],
            date: new Date(date[2], date[1]-1, date[0]),
            amount: +v[2].replace(',','.'),
            targetAccount: v[4],
            targetBank: v[5],
            recieversMessage: v[6],
            note: v[7].replace('\r\n', ''),
            type: v[8]
        };
    });
}
