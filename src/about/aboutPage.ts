import { IPages } from '../index';
import { TopToolbar } from "../top-toolbar/top-toolbar";

declare let window: IPages;

window.about = (): void => {
	let baseURLDev = "./";
    let topToolbar = new TopToolbar({
        onBackClick: handleBackClick,
        fileName: 'About'
    });
    topToolbar.appendTo('#topToolbar');

    function handleBackClick() {
        window.location.href = baseURLDev+'';
    }
};