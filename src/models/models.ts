export interface DataRow {
    [key: string]:  string;
};

export type DataTable = DataRow[];

export type ColumnName = string[];