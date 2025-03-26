const ColumnNameMapper = require("./ColumnNameMapper");

const HdfcbstExtractor = require("./HdfcAccountStatementExtractor");
const SbibstExtractor = require("./SbiAccountStatementExtractor");

const EXTRACTORS_NAME_MAP = {
    "HDFC_AST_XLS_V1": "HDFC ACCOUNT STATEMENT EXTRACTOR - XLS V1",
    "SBI_AST_XLS_V1": "SBI ACCOUNT STATEMENT EXTRACTOR - XLS V1"
};

const EXTRACTORS_MAP = {
    "HDFC_AST_XLS_V1": HdfcbstExtractor.getTransactionsFromXlsV1,
    "SBI_AST_XLS_V1": SbibstExtractor.getTransactionsFromXlsV1,
};

function extract(extractor, jsonData) {
    return EXTRACTORS_MAP[extractor](jsonData);
}

function getExtractorKeys(){
    return Object.keys(EXTRACTORS_NAME_MAP);
}

function getExtractorName(extractor){
    return EXTRACTORS_NAME_MAP[extractor];
}

function renameColumns(transactions){
    return transactions.map(transaction => {
        const newTransaction = {};
        Object.keys(transaction).forEach(columnName => {
            const genericColumnName = ColumnNameMapper.convertToGenericColumnName(columnName);
            if (!genericColumnName) {
                return;
            }
            newTransaction[genericColumnName] = ColumnNameMapper.processColumnValue(genericColumnName, transaction[columnName]);
        });
        return newTransaction;
    });

}

module.exports = {
    extract,
    getExtractorKeys,
    getExtractorName,
    renameColumns,
};