import { IPages } from '../index';
import { urlResponse, fileName } from '../layout/layout'
import { PdfViewer, Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, ThumbnailView, BookmarkView, TextSelection, TextSearch, FormFields, FormDesigner } from '@syncfusion/ej2-pdfviewer';
import { TopToolbar } from '../top-toolbar/top-toolbar';

PdfViewer.Inject(Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, ThumbnailView, BookmarkView, TextSelection, TextSearch, FormFields, FormDesigner);

declare let window: IPages;

window.pdfviewer = (): void => {
    
	let baseURLDev = "./";
	let topToolbar = new TopToolbar({
        onBackClick: handleBackClick,
        fileName: fileName
    });
    topToolbar.appendTo('#topToolbar');

    function handleBackClick() {
        if (viewerObj !=null){
            viewerObj.destroy();
        }
        window.location.href = baseURLDev+'';
    }

    let viewerObj :PdfViewer = new PdfViewer({
        created: created,
        height:'calc(100vh - 70px)',
        resourceUrl: "https://cdn.syncfusion.com/ej2/23.1.43/dist/ej2-pdfviewer-lib",
        documentLoad:documentLoad,
    });
    viewerObj.appendTo('#pdfviewerElement');

    function created() {
        if (urlResponse) {
            setTimeout(() => { viewerObj.load(urlResponse, ''); }, 5000);
        }
    }

    function documentLoad(args: any) {
        let file = (args.documentName === 'undefined.pdf') ? fileName : args.documentName;
        const fileExtension = file.split('.').pop();
        viewerObj.downloadFileName = (fileExtension === 'pptx') ? file.replace(/\.[^.]+$/, '.pdf') : file;
    }
}

