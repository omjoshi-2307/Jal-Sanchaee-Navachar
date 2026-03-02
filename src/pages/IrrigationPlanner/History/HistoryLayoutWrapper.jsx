import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import HistoryDashboard from "./HistoryDashboard";

export default function HistoryLayoutWrapper() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent' }}>
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />

            <main style={{
                flex: 1,
                marginLeft: isSidebarOpen ? '280px' : '0',
                transition: 'var(--transition)',
                minHeight: '100vh',
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

                {/* CSS Override to hide the redundant internal navbar of HistoryDashboard */}
                <style>
                    {`
                    .history-dashboard-container .navbar,
                    .history-dashboard-container .overlay-menu {
                        display: none !important;
                    }
                    /* Adjust the HistoryDashboard root div to not have its own background/min-height when in wrapper */
                    .history-dashboard-container > div:first-child {
                        min-height: auto !important;
                        background: transparent !important;
                        padding-top: 0 !important;
                    }
                    `}
                </style>

                <div className="history-dashboard-container" style={{ flex: 1 }}>
                    <HistoryDashboard />
                </div>
            </main>
        </div>
    );
}
