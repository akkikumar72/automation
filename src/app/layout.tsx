import type { Metadata } from 'next';
import { IS_DEVELOPMENT } from 'next.constants.mjs';
import { Inter } from 'next/font/google';

import { ScreenSize } from '~/components/atoms/utils/ScreenSize';
import { Toaster } from '~/components/ui/toast';
import '~/styles/globals.css';
import '~/styles/tailwind.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'TaskFlow',
    description: 'TaskFlow is a task management app that helps you manage your tasks and projects.'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                {children}

                {/*	In development mode, render a fixed component displaying the current viewport 
					width and corresponding Tailwind breakpoint, as a helper for responsive design. */}
                {IS_DEVELOPMENT && <ScreenSize />}
                <Toaster position='bottom-right' richColors />
            </body>
        </html>
    );
}
