import {FileController} from "./models/fileController.js";
import {renderTable} from "./controllers/table.js";
import {filterData} from "./controllers/filter.js";
import { ColumnName, DataRow} from "./models/models";
import { convertCsv, downloadCSV } from "./controllers/downloadCsv.js";

const csvForm = document.getElementById("csvForm") as HTMLFormElement;
const csvFile = document.getElementById("csvFile") as HTMLInputElement;
const displayArea = document.getElementById("displayArea") as HTMLDivElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const downloadCSVButton = document.getElementById("downloadCSV") as HTMLInputElement; 
const paginationHtml = document.getElementById("paginationControlls") as HTMLElement;

const recordsPerPage: number = 15;
let currentPage: number = 1;
let final_values: DataRow[] = [];
let columnNames: ColumnName = [];

function pagination(totalRecords: number, currentPage: number, recordsPerPage: number): string{
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const maxButtons = 10;
    let paginationHTML = '<ul class="pagination">';

 
    /*start*/
    if(currentPage > 1){
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="1" href="#">Start</a></li>`;
    }
    /*previous*/
    if(currentPage > 1){
        paginationHTML += `
        <li class="page-item"><a class="page-link" data-page="${currentPage - 1}" href="#">Previous</a></li>`
    }
     /* buttons in view*/
     let startPage = Math.max(1, currentPage-Math.floor(maxButtons/2));
     let finalPage = Math.min(totalPages,currentPage+Math.floor(maxButtons/2));
 
     for (let i = startPage; i <= finalPage; i++) {
         paginationHTML += `<li class="page-item ${i === currentPage ? ' active' : ''}"><a class="page-link" data-page="${i}">${i}</a></li>`;  
     }
    if(currentPage < totalPages){
        paginationHTML += `
        <li class="page-item"><a class="page-link" data-page="${currentPage + 1}" href="#">Next</a></li>`
    }
    if(currentPage < totalPages){
        paginationHTML += `
        <li class="page-item"><a class="page-link" data-page="${totalPages}" href="#">End</a></li>`
    }
    paginationHTML += '</ul>';
    return paginationHTML;
}


document.addEventListener("DOMContentLoaded",()=>{
    csvForm.addEventListener("submit", async (e: Event) => {
        e.preventDefault();
        const csvReader = new FileReader();
        const input = csvFile.files![0];
        const fileName = input.name;
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
        if(fileExtension !== 'csv' && fileExtension !== 'txt'){
            alert("Invalid file format. Please upload a CSV or TXT file.");
            return;
        }
    
        csvReader.onload = async function (evt){
            const text = evt.target?.result as string;
            const fileHandler = new FileController(text);
            final_values = fileHandler.getData();
            columnNames = fileHandler.getColumnNames();

            await renderTableControls();
        }
        csvReader.readAsText(input);
    })
    // Download CSV
    
    downloadCSVButton.addEventListener('click', async (e:Event) => {
        e.preventDefault();
        const filteresValues = filterData(final_values,searchInput.value);
        const csvData = await convertCsv(filteresValues, columnNames)
        await downloadCSV(csvData, 'filterd_data.csv');
    })
    searchInput.addEventListener('input', async (e:Event)=>{
        await renderTableControls();
    })
})



// Render table and add controlls
async function renderTableControls(){
    const searchTerm = searchInput.value;
    const filteredValues = filterData(final_values, searchTerm);

    /* render filtered values */
    const tableHTML = await renderTable(filteredValues, currentPage, recordsPerPage);
    displayArea.innerHTML = tableHTML;
    /*pagination */
    const paginationControls = await pagination(filteredValues.length, currentPage, recordsPerPage)
    paginationHtml!.innerHTML = paginationControls
    document.querySelectorAll('.page-link').forEach(button => {
        button.addEventListener('click', (ev: Event) => {
            const targetPage = Number((ev.target as HTMLElement).dataset.page)
            if (targetPage) {
                currentPage = targetPage
                renderTableControls()
            }
        })
    }) 
}

// Pagination

