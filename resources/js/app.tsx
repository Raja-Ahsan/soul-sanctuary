import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import DashboardLayout from '@/Layouts/DashboardLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Soul Sanctuary';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ).then((module) => {
            const page = module as {
                default: React.ComponentType & {
                    layout?: (page: React.ReactNode) => React.ReactNode;
                };
            };

            if (!page.default.layout) {
                if (
                    name.startsWith('Dashboard/') ||
                    name.startsWith('Profile/')
                ) {
                    page.default.layout = (pageNode) => (
                        <DashboardLayout>{pageNode}</DashboardLayout>
                    );
                }
            }

            return page;
        }),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#d4af6a',
    },
});
