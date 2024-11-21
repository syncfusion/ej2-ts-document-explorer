import { Spreadsheet } from '@syncfusion/ej2-spreadsheet';
import { IPages } from '../index';
import { TopToolbar } from "../top-toolbar/top-toolbar";
import { fileExcel, fileName } from '../layout/layout';

declare let window: IPages;

window.excel = (): void => {

	let baseURLDev = "./";
    let spreadsheetObj: Spreadsheet = new Spreadsheet({
        height: 'calc(100vh - 70px)',
        created: created,
        openUrl: 'https://services.syncfusion.com/js/production/api/spreadsheet/open',
        saveUrl: 'https://services.syncfusion.com/js/production/api/spreadsheet/save',
    });
    spreadsheetObj.appendTo('#spreadSheet');

    let topToolbar = new TopToolbar({
        onBackClick: handleBackClick,
        fileName: fileName
    });
    topToolbar.appendTo('#topToolbar');

    function handleBackClick() {
        window.location.href = baseURLDev+'';
    }

    function created() {
        spreadsheetObj.open({ file: fileExcel });
    }
};