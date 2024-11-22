import { DocumentEditorContainer, Toolbar, SfdtExport } from '@syncfusion/ej2-documenteditor';
import { IPages } from '../index';
import { TopToolbar } from "../top-toolbar/top-toolbar";
import { urlResponse, fileName } from '../layout/layout';

declare let window: IPages;
DocumentEditorContainer.Inject(Toolbar, SfdtExport);

window.docEditor = (): void => {
	
	let baseURLDev = "./";
    let documentEditor: DocumentEditorContainer = new DocumentEditorContainer({
        enableToolbar: true,
        height: 'calc(100vh - 70px)',
        serviceUrl: 'https://services.syncfusion.com/js/production/api/documenteditor/',
        created: created
    });
    documentEditor.appendTo('#docEditor');

    let topToolbar = new TopToolbar({
        onBackClick: handleBackClick,
        fileName: fileName
    });
    topToolbar.appendTo('#topToolbar');

    function handleBackClick() {
        if (documentEditor) {
            documentEditor.destroy()
        }
        window.location.href = baseURLDev+'';
    }

    function created() {
        if (urlResponse) {
            setTimeout(() => { documentEditor.documentEditor.open(urlResponse) }, 5000);
        }
    }
};