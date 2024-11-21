import { IPages } from '../index';
import { Toolbar, Sidebar, TreeView } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { FileManager, Toolbar as toolbarItems, DetailsView, FileOpenEventArgs, BeforeImageLoadEventArgs, beforeDownload } from '@syncfusion/ej2-filemanager';
import { Dialog } from '@syncfusion/ej2-popups';
import { environment } from '../environment/environment.prod';

FileManager.Inject(toolbarItems, DetailsView)

declare let window: IPages;

export let currentImageUrl: string;
export let fileName: string | any;
export let urlResponse: any;
export let fileExcel: any;

window.layout = (): void => {
  let data: { [key: string]: Object }[] = [
    { id: '01', name: 'All Files', Icon: "sf-icon-Allfiles", select: true },
    { id: '02', name: 'Recent Files', Icon: "sf-icon-RecentFiles", select: false },
    { id: '03', name: 'Shared with me', Icon: "e-icons e-shared", select: false },
    { id: '04', name: 'Trash', Icon: "sf-icon-Delete", select: false },
    { id: '05', name: 'About', Icon: "sf-icon-About", select: false }
  ];
  let baseURLDev = "./";
  let hostUrl: string = 'https://sfblazor.azurewebsites.net/documentexplorer-services/production/';
  let fileMenu: string[] = ["Open", "|", "Delete", "Download", "Rename", "|", "Details"];
  let folderMenu: string[] = ["Open", "|", "Delete", "Download", "Rename", "|", "Details"];
  let layoutMenu: string[] = ["SortBy", "View", "Refresh", "|", "NewFolder", "Upload", "|", "Details", "SelectAll"];
  let toolItems = ['Upload', 'SortBy', 'Refresh', 'Delete', 'Download', 'Rename', 'View', 'Details'];
  let popupVisibility: string = 'e-hide-popup';
  let sidebarToggle: boolean = false;
  let filePath: string | any;
  let isPDF: boolean = false;
  let isUnSupported: boolean = false;
  let isImageOpen: boolean = false;
  let fieldName: string = "";
  let isProduction: any = environment.production;
  let buttons: any = [
    {
      'click': () => {
        dialogObj.hide();
      },
      buttonModel: {
        isPrimary: true,
        content: 'OK'
      }
    },
  ];

  if (isProduction) {
    toolItems = ['SortBy', 'Refresh', 'Delete', 'Download', 'Rename', 'View', 'Details'];
  }
  else {
    toolItems = ['Upload', 'SortBy', 'Refresh', 'Delete', 'Download', 'Rename', 'View', 'Details'];
  }

  let toolbar: Toolbar = new Toolbar({
    items: [
      { cssClass: 'e-icons e-hamburger-icon', align: 'Left', tooltipText: 'Menu', click: hamburgerClick, template: '<span class="e-hamburger"></span>' },
      { cssClass: 'e-header-icon', align: 'Left', tooltipText: 'Menu', template: '<span class="e-folder-logo e-header-icon" ><img width="30px" src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMzIgMzIiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojZWJiODI0O30uY2xzLTIsLmNscy0ze2ZpbGw6I2ZmZjt9LmNscy0ye29wYWNpdHk6MC42NTt9LmNscy0ze29wYWNpdHk6MC40O30uY2xzLTR7ZmlsbDp1cmwoI2xpbmVhci1ncmFkaWVudCk7fTwvc3R5bGU+PGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQiIHgxPSIxNiIgeTE9IjM0LjgyIiB4Mj0iMTYiIHkyPSIxNS40NyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2FkZDdmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzZhYmNmZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjx0aXRsZT5Mb2dvPC90aXRsZT48cmVjdCBjbGFzcz0iY2xzLTEiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgcng9IjYuMDgiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yLjg4LDYuNzJoMjYuNEEuMzIuMzIsMCwwLDEsMjkuNiw3djEwLjRoLTI3VjdBLjMyLjMyLDAsMCwxLDIuODgsNi43MloiLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik00LjMyLDQuNDhIMjhhLjMyLjMyLDAsMCwxLC4zMi4zMlY2LjcySDRWNC44QS4zMi4zMiwwLDAsMSw0LjMyLDQuNDhaIi8+PHBhdGggY2xhc3M9ImNscy00IiBkPSJNMS42LDkuOEg5YTEuNjEsMS42MSwwLDAsMSwxLjEuNDRsNCwzLjgxYTEuNTksMS41OSwwLDAsMCwxLjA3LjQ0bDE1LjI4LjI4QTEuNjEsMS42MSwwLDAsMSwzMiwxNi4zN3Y5LjU1QTYuMDgsNi4wOCwwLDAsMSwyNS45MiwzMkg2LjA4QTYuMDgsNi4wOCwwLDAsMSwwLDI1LjkyVjExLjRBMS42LDEuNiwwLDAsMSwxLjYsOS44WiIvPjwvc3ZnPg==" alt="header-img" /></span>' },
      { text: 'Document Explorer', align: 'Left', cssClass: 'doc-header' },
      { align: 'Right', id: 'User', cssClass: "popupVisibility === 'e-hide-popup' ? 'e-user-icon' : 'e-user-icon select-highlight'", tooltipText: 'User', template: '<span id="User-Img" class="e-user-img e-avatar e-avatar-circle"></span>', click: toolbarClick },
      { align: 'Right', id: 'GitHub', tooltipText: 'https://github.com/syncfusion/blazor-showcase-document-explorer', template: '<span class="sf-icon-Github"> </span>' }
    ],
    height: '52px'
  });
  toolbar.appendTo('#element');

  let sideObj: Sidebar = new Sidebar({
    width: "260px",
    position: 'Left',
    animate: false,
    enableGestures: false,
    target: '.e-mainLayout-content',
    mediaQuery: '(min-width: 600px)',
    isOpen: sidebarToggle,
    open: openClick,
    close: closeClick
  });
  sideObj.appendTo("#defaultSidebar");

  let button: Button = new Button({
    content: 'New Folder',
    isPrimary: true,
    cssClass: "e-name e-icons e-plus",
  });
  button.appendTo('#btnElement');

  button.element.onclick = (): void => {
    filemanager.createFolder();
  }

  let treeViewInstance: TreeView = new TreeView({
    fields: { dataSource: data, id: 'id', text: 'name', selected: 'select', iconCss: 'Icon' },
    nodeSelected: handleTreeSelect
  });
  treeViewInstance.appendTo("#treeElement");

  let filemanager: FileManager = new FileManager({
    height: '100%',
    width: '100%',
    ajaxSettings: {
      url: hostUrl + 'api/FileManager/FileOperations',
      getImageUrl: hostUrl + 'api/FileManager/GetImage',
      uploadUrl: hostUrl + 'api/FileManager/Upload',
      downloadUrl: hostUrl + 'api/FileManager/Download'
    },
    contextMenuSettings: { file: fileMenu, folder: folderMenu, layout: layoutMenu },
    toolbarSettings: { items: toolItems, visible: true },
    enablePersistence: true,
    fileOpen: onFileOpen,
    beforeImageLoad: beforeImageLoad,
    beforeSend: beforeSend,
    beforeDownload: beforeDownload
  });
  filemanager.appendTo('#filemanager');

  let dialogObj: Dialog = new Dialog({
    content: 'This type of file cannot be previewed.',
    width: '335px',
    height: '190px',
    isModal: true,
    visible: isUnSupported,
    buttons: buttons
  });
  dialogObj.appendTo('#dialogElement')

  function onFileOpen(args: FileOpenEventArgs) {
    let file = (args as any).fileDetails;
    fileName = file.name;
    filePath = file.filterPath
    let path: string = file.filterPath.replace(/\\/g, "/") + fileName;
    if (file.isFile) {
      switch (file.type) {
        case ".jpg":
        case ".png":
        case ".dib":
        case ".jpeg":
        case ".jpe":
        case ".jfif":
        case ".gif":
        case ".tif":
        case ".tiff":
        case ".ico":
          isImageOpen = true;
          break;
        case ".pdf":
        case ".pptx":
          isPDF = true;
          getFileStream(path, true);
          break;
        case '.docx':
        case '.doc':
        case '.rtf':
        case '.txt':
          isPDF = false;
          getFileStream(path, false);
          break;
        case ".xlsx":
          getBlob(fileName, path);
          break;
        default:
          isUnSupported = true;
          dialogObj.show();
          dialogObj.header = fileName;
          break;
      }
    }
  }

  function beforeImageLoad(args: BeforeImageLoadEventArgs) {
    if (isImageOpen) {
      let file = (args as any).fileDetails;
      if (args.imageUrl) {
        currentImageUrl = args.imageUrl;
      }
      fileName = file[0].name;
      filePath = file[0].filterPath;
      isImageOpen = false;
      window.location.href = baseURLDev+'#/image';
    }
    isImageOpen = false;
  }

  function getFileStream(path: any, isPDF: boolean) {
    let ajax: XMLHttpRequest = new XMLHttpRequest();
    ajax.open("POST", hostUrl + "api/FileManager/GetDocument", true);
    ajax.setRequestHeader("content-type", "application/json");
    ajax.onreadystatechange = () => {
      if (ajax.readyState === 4) {
        if (ajax.status === 200 || ajax.status === 304) {
          onFileLoad(ajax.responseText, isPDF);
        }
      }
    };
    ajax.send(JSON.stringify({ "FileName": path, "Action": (!isPDF ? "ImportFile" : "LoadPDF") }));
  }

  function onFileLoad(response: string, isPDF: boolean) {
    urlResponse = response;
    if (isPDF) {
      window.location.href = baseURLDev+'#/pdfviewer';
    }
    else {
      window.location.href = baseURLDev+'#/docEditor';
    }
  }

  function getBlob(fileName: string, Path: string) {
    let request: XMLHttpRequest = new XMLHttpRequest();
    request.responseType = "blob";
    request.onload = () => {
      let file: any = new File([request.response], fileName);
      getExcel(fileName, file);
    }
    request.open("GET", hostUrl + "api/FileManager/GetExcel" + "?FileName=" + Path);
    request.send();
  }

  function getExcel(fileName: string, file: object) {
    fileName = fileName;
    fileExcel = file;
    window.location.href = baseURLDev+'#/excel';

  }

  function beforeSend(args: any): void {
    if (args.action != "upload") {
      args.ajaxSettings.beforeSend = function (args: any) {
        args.httpRequest.setRequestHeader('Authorization', fieldName);
      };
    }
  }

  function beforeDownload(args: any): void {
    if (fieldName == "Recent") {
      var modifiedPath = args.data.data[0].filterPath;
      args.data.path = modifiedPath;
    }
  }

  function hamburgerClick(args: any) {
    sidebarToggle = !sidebarToggle;
    sideObj.isOpen = sidebarToggle;
  }

  function openClick(args: any) {
    document.getElementById('file-overlay')?.classList.add('e-file-show-overlay');
    document.getElementById('file-overlay')?.classList.remove('e-file-hide-overlay');
    sidebarToggle = true;
  }

  function closeClick(args: any) {
    document.getElementById('file-overlay')?.classList.remove('e-file-show-overlay');
    document.getElementById('file-overlay')?.classList.add('e-file-hide-overlay');
    sidebarToggle = false;
  }

  function toolbarClick(args: any) {
    switch (args.item.id) {
      case 'User':
        document.getElementById('user-Popup')?.classList.add(popupVisibility === 'e-hide-popup' ? 'e-show-popup' : 'e-hide-popup');
        document.getElementById('user-label')?.classList.add(popupVisibility === 'e-hide-popup' ? 'e-show-popup' : 'e-hide-popup');
        popupVisibility = popupVisibility === 'e-hide-popup' ? 'e-show-popup' : 'e-hide-popup';

        if (popupVisibility === 'e-show-popup') {
          document.getElementById('user-Popup')?.classList.remove('e-hide-popup');
          document.getElementById('user-label')?.classList.remove('e-hide-popup');
        }
        break;
      case 'GitHub':
        window.open('https://github.com/essential-studio/ej2-angular-document-explorer', '_blank'); // Navigate to GitHub in a new tab
        break;
      default:
        break;
    }
  }

  function handleTreeSelect(args: any) {
    filemanager.clearSelection();
    filemanager.path = "/";
    let treeNode = args.nodeData.id;
    var flag = false;
    if (treeNode === "05") {
      flag = true;
  }

    switch (treeNode) {
      case "02":
        filemanager.toolbarSettings = { items: ["Download", "Rename", "SortBy", "Refresh", "Selection", "View", "Details"], visible: true };
        filemanager.contextMenuSettings = { file: ["Open", "|", "Delete", "Download", "Rename", "|", "Details"], folder: ["Open", "|", "Delete", "Download", "Rename", "|", "Details"], layout: ["SortBy", "View", "Refresh", "|", "NewFolder", "Upload", "|", "Details", "SelectAll"], visible: true };
        fieldName = "Recent";
        filemanager.ajaxSettings = {
          url: hostUrl + 'api/FileManager/FileOperations',
          getImageUrl: hostUrl + 'api/FileManager/GetImage',
          downloadUrl: hostUrl + 'api/FileManager/Download'
        };
        break;
      case "03":
        filemanager.toolbarSettings = { items: ["Download", "SortBy", "Refresh", "Selection", "View", "Details"], visible: true };
        filemanager.contextMenuSettings = { file: ["Open", "|", "Download", "|", "Details"], folder: ["Open", "|", "Download", "|", "Details"], layout: ["SortBy", "|", "View", "|", "Refresh", "|", "Details", "|", "SelectAll"], visible: true };
        fieldName = "Shared";
        filemanager.ajaxSettings = {
          url: hostUrl + 'api/SharedFiles/FileOperations',
          getImageUrl: hostUrl + 'api/SharedFiles/GetImage',
          downloadUrl: hostUrl + 'api/SharedFiles/Download'
        };
        break;
      case "04":
        filemanager.toolbarSettings = { items: ["Delete", "SortBy", "Refresh", "Selection", "View", "Details"], visible: true };
        filemanager.contextMenuSettings = { file: ["Delete", "|", "Details", "|", "Restore", "EmptyTrash", "|", "SelectAll"], folder: ["Download", "|", "Details", "|", "Restore", "EmptyTrash", "|", "SelectAll"], layout: ["SortBy", "View", "Refresh", "|", "Details", "SelectAll", "|", "Restore", "EmptyTrash"], visible: true };
        fieldName = "Trash";
        filemanager.ajaxSettings = {
          url: hostUrl + 'api/Trash/FileOperations',
          getImageUrl: hostUrl + 'api/Trash/GetImage',
        };
        break;
        break;
      case "05":
        window.location.href = baseURLDev+'#/about';
        break;
      default:
        if (isProduction) {
          filemanager.toolbarSettings = { items: ["Delete", "Download", "Rename", "SortBy", "Refresh", "Selection", "View", "Details"], visible: true };
        }
        else {
          filemanager.toolbarSettings = { items: ["Upload", "Delete", "Download", "Rename", "SortBy", "Refresh", "Selection", "View", "Details"], visible: true };
        }
        filemanager.contextMenuSettings = { file: ["Open", "|", "Delete", "Download", "Rename", "|", "Details"], folder: ["Open", "|", "Delete", "Download", "Rename", "|", "Details"], layout: ["SortBy", "View", "Refresh", "|", "NewFolder", "Upload", "|", "Details", "SelectAll"], visible: true };
        fieldName = "AllFiles";
        filemanager.ajaxSettings = {
          url: hostUrl + 'api/FileManager/FileOperations',
          getImageUrl: hostUrl + 'api/FileManager/GetImage',
          uploadUrl: hostUrl + 'api/FileManager/Upload',
          downloadUrl: hostUrl + 'api/FileManager/Download'
        };
        break;
    }
    if (!flag) {
      filemanager.path = "/";
      filemanager.refresh();
    }
  };
};