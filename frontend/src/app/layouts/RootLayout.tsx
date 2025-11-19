import React, { Suspense, useEffect } from 'react';
import { useAppStore } from '@/store/store';
import { Toaster } from 'react-hot-toast';
import Header from "@/components/Header";
import Main from "@/components/Main";
import Body from "@/components/Body";
import ProductSkeleton from '@/components/ProductSkeleton';
import Synchronizer from '@/components/Synchronizer';

const ControlPanel = React.lazy(() => import('@/features/controlPanel/ControlPanelSection'));
const LiveFeedSection = React.lazy(() => import('@/features/livefeed/LiveFeedSection'));
const GenerativeAISection = React.lazy(() => import('@/features/generativeAI/GenerativeAISection'));

export function RootLayout() {

    const setUserId = useAppStore((state) => state.setUserId);
    useEffect(() => {
        setUserId();
    }, [setUserId]);

    return (
        <>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    className: '',
                    duration: 5000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                    },
                    error: {
                        style: {
                            background: 'red',
                            width: '400px'
                        },
                    },
                }}
            />
            <Body>
                <Header />
                <Main>
                    <Synchronizer />
                    <Suspense fallback={<ProductSkeleton />}>
                        <ControlPanel />
                        <LiveFeedSection />
                        <GenerativeAISection />
                    </Suspense>
                </Main>
            </Body>
        </>
    )
}