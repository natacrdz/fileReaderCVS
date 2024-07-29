import { DataRow, ColumnName } from "../models/models";

export async function convertCsv(data: DataRow[], columnNames: ColumnName): Promise<string>{
    const csvRows=[];
    /* add headers */
    csvRows.push(columnNames.join(","));
    /* add data */
    data.forEach(row=>{
        const values = columnNames.map(column=>row[column] || "");
        csvRows.push(values.join(""));
    })
    return csvRows.join("\n");
}

export async function downloadCSV(csvContent: string, fileName: string){
     /*blob objeto de datos inmutables y binario*/
     const blob = new Blob([csvContent], {type: 'text/csv; charset=UTF-8'});
     /*descarga el blob como archivo*/
         const link = document.createElement('a');
         link.href = URL.createObjectURL(blob);
         link.download = fileName;
         document.body.appendChild(link);
         /*trigger*/
         link.click();
         /*elimina el link*/
         document.body.removeChild(link);
}