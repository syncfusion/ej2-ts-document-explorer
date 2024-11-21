import * as hasher from 'hasher';
import crossroads from 'crossroads';
import { Ajax } from '@syncfusion/ej2-base';
import '../styles/index.scss';
let pages: Object[] = [
    { root: '', page: 'layout' },
    {root:'topToolbar',page:'top-toolbar'},
    { root: 'about', page: 'aboutPage' },
    {root: 'image' , page:'imageEditor'},
    {root:'pdfviewer',page:'pdfviewer'},
    {root:'docEditor',page:'docEditor'},
    {root:'excel',page:'excel'}
];
export interface IPages extends Window {
    // All route pages declared here.
    layout: () => any;
    about: () => any;
    image :()=> any;
    pdfviewer: ()=> any;
    docEditor: () => any;
    excel: () => any;
}

declare let window: IPages;
routeDefault();

function routeDefault() {
    crossroads.addRoute('', function() {
        loadPage('');
    });
}

// Add route handler for about page
crossroads.addRoute('/about', function() {
    loadPage('about');
});

crossroads.addRoute('/pdfviewer', function() {
    loadPage('pdfviewer');
});

crossroads.addRoute('/image', function() {
    loadPage('image');
});

crossroads.addRoute('/docEditor', function() {
    loadPage('docEditor');
});

crossroads.addRoute('/excel', function() {
    loadPage('excel');
});

function loadPage(page : any) {
    let pageObj: { [key: string]: Object } = getPageObj(window.location.hash.replace('#/', ''));
    let ajaxHTML: Ajax = new Ajax('./' + pageObj.page + '.html', 'GET', true);
    ajaxHTML.send().then((value: Object): void => {
        if (document.getElementById('content-area')) {
            (document.getElementById('content-area') as HTMLElement).innerHTML = value.toString();
        }
        if (window.location.hash.replace('#/', '') === '') {
            window.layout();
        } else if(window.location.hash.replace('#/', '')==='about'){
            window.about();
        }else if (window.location.hash.replace('#/', '')==='image'){
            window.image();
        }else if (window.location.hash.replace('#/', '')==='pdfviewer'){
            window.pdfviewer();
        }else if (window.location.hash.replace('#/', '')==='docEditor'){
            window.docEditor();
        }else if (window.location.hash.replace('#/', '')==='excel'){
            window.excel();
        }      
    })
    .catch((error: any) => {
        // Handle any potential Promise rejections
        console.error('An error occurred:', error);
      });
}
function getPageObj(page: string): { [key: string]: Object } {
    let pageObj: { [key: string]: Object } = {};
    pages.forEach((item: any) => {
        if (item.root === page) {
            pageObj = item;
        }
    });
    return pageObj;
}

// Window location hash handlers
hasher.initialized.add((hashValue: string) => {
    crossroads.parse(hashValue); // Page initial loading state this function calls '' route handler.
});
hasher.changed.add((hashValue: string) => {
    crossroads.parse(hashValue); // When location hash changed this function calls `home` route handler.
});
hasher.init(); // Initiate the hasher function
