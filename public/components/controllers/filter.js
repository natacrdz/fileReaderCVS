export function filterData(arrayTable, searchTerm) {
    if (!searchTerm)
        return arrayTable;
    const lowerCaseTerm = searchTerm.toLowerCase(); //convertit todo a minuscula
    return arrayTable.filter((row) => Object.values(row).some((cell) => {
        //cada fila se convierte en un objeto
        if (cell === null || cell === undefined)
            return false; //manejo de errores
        return cell.toString().toLowerCase().includes(lowerCaseTerm);
    }));
}
