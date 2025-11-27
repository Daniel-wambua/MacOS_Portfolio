import WindowWrapper from "#hoc/WindowWrapper.jsx";
import {WindowControls} from "#components/index.js";
import {Download} from "lucide-react";
import {Document, Page, pdfjs} from 'react-pdf';
import { useEffect, useState } from 'react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


const Resume = () => {
    const [pageWidth, setPageWidth] = useState(undefined);

    useEffect(() => {
        const update = () => {
            // Use container width or viewport width for mobile
            const vw = Math.min(window.innerWidth, 1024);
            setPageWidth(vw - 24); // a little padding
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <>
            <div id="window-header">
                <WindowControls target="resume" />
                <h2>Resume.pdf</h2>

                <a href="/files/resume.pdf"
                   download="resume.pdf"
                   className="cursor-pointer"
                   title="Download resume">

                    <Download className="icon" />
                </a>
            </div>

            <div className="px-3 max-sm:px-2">
                <Document file="files/resume.pdf">
                    <Page pageNumber={1}
                          renderTextLayer
                          renderAnnotationLayer
                          width={pageWidth}
                    />
                </Document>
            </div>
        </>
    );
};
const ResumeWindow = WindowWrapper(Resume, "resume");
export default ResumeWindow;
