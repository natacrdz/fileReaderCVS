import {DataTable} from "../models/models";

export async function renderTable(arrayTable: DataTable, currentPage: number, recordsPerPage: number): Promise<string>  {
   /*Index Start and end*/
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedData = arrayTable.slice(startIndex, endIndex);
  
    /*Column names from the first row*/ 

    const columnName = arrayTable.length > 0 ? Object.keys(arrayTable[0]): [];

    return `
        <table class="table table-stripped">
            <thead>
                ${columnName.map(value=>`
                    <th scope="col">${value}</th>
                `).join('')}
            <thead>
            <tbody>
                ${paginatedData.map(row=>`
                    <tr>
                        ${columnName.map(columnName=>`
                            <td>${row[columnName] || ''}</td>
                        `).join('')}
                    <tr>`).join('')}
            </tbody>
        </table>
    `

}