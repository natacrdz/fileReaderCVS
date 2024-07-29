var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FileController } from "./models/fileController.js";
import { renderTable } from "./controllers/table.js";
import { filterData } from "./controllers/filter.js";
import { convertCsv, downloadCSV } from "./controllers/downloadCsv.js";
const csvForm = document.getElementById("csvForm");
const csvFile = document.getElementById("csvFile");
const displayArea = document.getElementById("displayArea");
const searchInput = document.getElementById("searchInput");
const downloadCSVButton = document.getElementById("downloadCSV");
const paginationHtml = document.getElementById("paginationControlls");
const recordsPerPage = 15;
let currentPage = 1;
let final_values = [];
let columnNames = [];
function pagination(totalRecords, currentPage, recordsPerPage) {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const maxButtons = 10;
    let paginationHTML = '<ul class="pagination">';
    /*start*/
    if (currentPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="1" href="#">Start</a></li>`;
    }
    /*previous*/
    if (currentPage > 1) {
        paginationHTML += `
        <li class="page-item"><a class="page-link" data-page="${currentPage - 1}" href="#">Previous</a></li>`;
    }
    /* buttons in view*/
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let finalPage = Math.min(totalPages, currentPage + Math.floor(maxButtons / 2));
    for (let i = startPage; i <= finalPage; i++) {
        paginationHTML += `<li class="page-item ${i === currentPage ? ' active' : ''}"><a class="page-link" data-page="${i}">${i}</a></li>`;
    }
    if (currentPage < totalPages) {
        paginationHTML += `
        <li class="page-item"><a class="page-link" data-page="${currentPage + 1}" href="#">Next</a></li>`;
    }
    if (currentPage < totalPages) {
        paginationHTML += `
        <li class="page-item"><a class="page-link" data-page="${totalPages}" href="#">End</a></li>`;
    }
    paginationHTML += '</ul>';
    return paginationHTML;
}
document.addEventListener("DOMContentLoaded", () => {
    csvForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        e.preventDefault();
        const csvReader = new FileReader();
        const input = csvFile.files[0];
        const fileName = input.name;
        const fileExtension = (_a = fileName.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (fileExtension !== 'csv' && fileExtension !== 'txt') {
            alert("Invalid file format. Please upload a CSV or TXT file.");
            return;
        }
        csvReader.onload = function (evt) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const text = (_a = evt.target) === null || _a === void 0 ? void 0 : _a.result;
                const fileHandler = new FileController(text);
                final_values = fileHandler.getData();
                columnNames = fileHandler.getColumnNames();
                yield renderTableControls();
            });
        };
        csvReader.readAsText(input);
    }));
    // Download CSV
    downloadCSVButton.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const filteresValues = filterData(final_values, searchInput.value);
        const csvData = yield convertCsv(filteresValues, columnNames);
        yield downloadCSV(csvData, 'filterd_data.csv');
    }));
    searchInput.addEventListener('input', (e) => __awaiter(void 0, void 0, void 0, function* () {
        yield renderTableControls();
    }));
});
// Render table and add controlls
function renderTableControls() {
    return __awaiter(this, void 0, void 0, function* () {
        const searchTerm = searchInput.value;
        const filteredValues = filterData(final_values, searchTerm);
        /* render filtered values */
        const tableHTML = yield renderTable(filteredValues, currentPage, recordsPerPage);
        displayArea.innerHTML = tableHTML;
        /*pagination */
        const paginationControls = yield pagination(filteredValues.length, currentPage, recordsPerPage);
        paginationHtml.innerHTML = paginationControls;
        document.querySelectorAll('.page-link').forEach(button => {
            button.addEventListener('click', (ev) => {
                const targetPage = Number(ev.target.dataset.page);
                if (targetPage) {
                    currentPage = targetPage;
                    renderTableControls();
                }
            });
        });
    });
}
// Pagination
