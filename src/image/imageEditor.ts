import { ImageEditor } from '@syncfusion/ej2-image-editor';
import { IPages } from '../index';
import { TopToolbar } from "../top-toolbar/top-toolbar";
import { currentImageUrl, fileName } from '../layout/layout';

declare let window: IPages;

window.image = (): void => {
    
	let baseURLDev = "./";
	let imageUrl: string;
    imageUrl = currentImageUrl;

    let imageEditor = new ImageEditor({
        created: () => {
            imageEditor.open(imageUrl);
        },
        beforeSave: beforeSave,
    });
    imageEditor.appendTo('#imageEditor');

    let topToolbar = new TopToolbar({
        onBackClick: handleBackClick,
        fileName: fileName
    });
    topToolbar.appendTo('#topToolbar');

    function handleBackClick() {
        window.location.href = baseURLDev+'';
    }

    function beforeSave(args: any) {
        let newFileName = (args.fileName).startsWith('Get') ? fileName : args.fileName;
        const fileNameWithoutExtension = newFileName.replace(/\.[^/.]+$/, '');
        args.fileName = fileNameWithoutExtension;
    }
};