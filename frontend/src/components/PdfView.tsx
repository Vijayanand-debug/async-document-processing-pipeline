import { createPluginRegistration } from '@embedpdf/core';
import { EmbedPDF } from '@embedpdf/core/react';
import { usePdfiumEngine } from '@embedpdf/engines/react';

// Import the essential plugins
import { Viewport, ViewportPluginPackage } from '@embedpdf/plugin-viewport/react';
import { Scroller, ScrollPluginPackage } from '@embedpdf/plugin-scroll/react';
import { LoaderPluginPackage } from '@embedpdf/plugin-loader/react';
import { RenderLayer, RenderPluginPackage } from '@embedpdf/plugin-render/react';

const appUrl = import.meta.env.VITE_APP_BASE_URL;

// this is a minimalistic implementation of embedpdf, for additional features
// please read the documentation at https://www.embedpdf.com/docs/react/introduction

// 1. Load the plugins 
const plugins = [
    createPluginRegistration(LoaderPluginPackage, {
        loadingOptions: {
            type: 'url',
            pdfFile: {
                id: 'relativity-pdf',
                url: `${appUrl}/rel.pdf`,
            },
        },
    }),
    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage),
    createPluginRegistration(RenderPluginPackage),
];

export default function PdfView() {
    // 2. Initialize the engine with the React hook
    const { engine, isLoading } = usePdfiumEngine();

    if (isLoading || !engine) {
        return <div>Loading PDF Engine...</div>;
    }
    return (
        <>
            <div style={{ height: '550px' }}>
                <EmbedPDF engine={engine} plugins={plugins}>
                    <Viewport
                        style={{
                            backgroundColor: '#f1f3f5',
                        }}
                    >
                        <Scroller
                            renderPage={({ width, height, pageIndex, scale }) => (
                                <div style={{ width, height }}>
                                    <RenderLayer pageIndex={pageIndex} scale={scale} />
                                </div>
                            )}
                        />
                    </Viewport>
                </EmbedPDF>
            </div>

        </>
    )
}