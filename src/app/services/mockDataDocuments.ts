import { DocumentData, DocumentDetailData } from './documents.service';

export const mock_folders: Array<DocumentData> = [
    {
        "_id": 1,
        "name": "ABC",
        "layoutNumber": 1,
        "formats": "JPG, PDF",
        "date": "2013-07-01",
    },
    {
        "_id": 2,
        "name": "XYZ",
        "layoutNumber": 1,
        "formats": "PNG, PDF",
        "date": "2013-07-01",
    }
];


export const mock_files: Array<DocumentDetailData> = [
    {
        "_id": 10,
        "id_Folder": 1,
        "name": "ABC",
        "layoutNumber": "1a",
        "formats": "JPG",
        "date": "2013-07-01"
    }, {
        "_id": 11,
        "id_Folder": 1,
        "name": "ABC",
        "layoutNumber": "1b",
        "formats": "PDF",
        "date": "2013-07-01"
    },
    {
        "_id": 10,
        "id_Folder": 2,
        "name": "XYZ",
        "layoutNumber": "2a",
        "formats": "PNG",
        "date": "2013-07-01"
    }, {
        "_id": 11,
        "id_Folder": 2,
        "name": "XYZ",
        "layoutNumber": "2b",
        "formats": "PDF",
        "date": "2013-07-01"
    }
];


// export const mock_DocumentFolders: Array<DocumentData> = [
//     {
//         "_id": 0,
//         "name": "ABC",
//         "layoutNumber": 1,
//         "formats": "JPG, PDF",
//         "date": "2013-07-01",
//         "documentDetail": [{
//             "_id": 10,
//             "name": "ABC",
//             "layoutNumber": "1a",
//             "format": "JPG",
//             "date": "2013-07-01"
//         }, {
//             "_id": 11,
//             "name": "ABC",
//             "layoutNumber": "1b",
//             "format": "PDF",
//             "date": "2013-07-01"
//         }]
//     },
//     {
//         "_id": 1,
//         "name": "XYZ",
//         "layoutNumber": 1,
//         "formats": "PNG, PDF",
//         "date": "2013-07-01",
//         "documentDetail": [{
//             "_id": 10,
//             "name": "XYZ",
//             "layoutNumber": "2a",
//             "format": "PNG",
//             "date": "2013-07-01"
//         }, {
//             "_id": 11,
//             "name": "XYZ",
//             "layoutNumber": "2b",
//             "format": "PDF",
//             "date": "2013-07-01"
//         }]
//     }
// ];