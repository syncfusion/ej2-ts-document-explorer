import { Toolbar } from "@syncfusion/ej2-navigations";
import { IPages } from '../index';

interface TopToolbarProps {
    onBackClick: (value: string) => void;
    fileName: string;
}

export class TopToolbar {
    public onBackClick: (value: string) => void;
    public fileName: string;

    constructor(props: TopToolbarProps) {
        this.onBackClick = props.onBackClick;
        this.fileName = props.fileName;
    }

    public appendTo(selector: string) {
        let toolbar: Toolbar = new Toolbar({
            items: [
                { align: 'Left', prefixIcon: 'e-icons e-chevron-left', tooltipText: 'Back',click:this.onBackClick },
                { align: 'Left', template: `<span>${this.fileName}</span>` },
                { align: 'Right', prefixIcon: 'e-icons e-close', tooltipText: 'Close',click:this.onBackClick },
            ]
        });
        toolbar.appendTo(selector);
    }
}



