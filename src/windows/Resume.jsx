import WindowWrapper from "#hoc/WindowWrapper.jsx";
import {WindowControls} from "#components/index.js";
import {Download, ExternalLink} from "lucide-react";
import {Document, Page, pdfjs} from 'react-pdf';
import { useState } from 'react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


const Resume = () => {
    const filePath = "https://danielwambua.dev/downloads/Daniel-Wambua-CV.pdf";
    const [numPages, setNumPages] = useState(0);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages || 0);
    };

    const openInNewTab = () => {
        try {
            window.open(filePath, "_blank", "noopener,noreferrer");
        } catch (e) {
            console.warn("Failed to open in new tab", e);
        }
    };

    const isIOS = () => {
        if (typeof navigator === 'undefined') return false;
        const ua = navigator.userAgent || navigator.vendor || "";
        const iOS = /iPad|iPhone|iPod/i.test(ua);
        const iPadOS13Plus = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
        return iOS || iPadOS13Plus;
    };

    const downloadResume = () => {
        try {
            // iOS Safari has limited support for programmatic downloads; open in new tab as a fallback
            if (isIOS()) {
                openInNewTab();
                return;
            }

            const a = document.createElement('a');
            a.href = filePath;
            a.download = 'resume.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            console.warn('Download failed, falling back to new tab', e);
            openInNewTab();
        }
    };

    return (
        <>
            <div id="window-header">
                <WindowControls target="resume" />
                <h2>Resume.pdf</h2>

                <div className="ml-auto flex items-center gap-1 max-sm:gap-2">
                    <button
                        type="button"
                        onClick={openInNewTab}
                        aria-label="Open resume in new tab"
                        title="Open in new tab"
                        className="inline-flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 active:scale-95 transition p-1 max-sm:p-2 max-sm:min-w-[44px] max-sm:min-h-[44px]"
                    >
                        <ExternalLink className="icon" />
                    </button>
                    <button
                        type="button"
                        onClick={downloadResume}
                        aria-label="Download resume"
                        title="Download"
                        className="inline-flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 active:scale-95 transition p-1 max-sm:p-2 max-sm:min-w-[44px] max-sm:min-h-[44px]"
                    >
                        <Download className="icon" />
                    </button>
                </div>
            </div>

            <Document file={filePath} onLoadSuccess={onDocumentLoadSuccess}>
                {numPages > 0
                    ? Array.from({ length: numPages }, (_, i) => (
                        <Page
                            key={`page_${i + 1}`}
                            pageNumber={i + 1}
                            renderTextLayer
                            renderAnnotationLayer
                        />
                    ))
                    : (
                        <Page
                            pageNumber={1}
                            renderTextLayer
                            renderAnnotationLayer
                        />
                    )}
            </Document>
        </>
    );
};
const ResumeWindow = WindowWrapper(Resume, "resume");
export default ResumeWindow;
