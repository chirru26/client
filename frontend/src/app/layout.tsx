import '@/app/globals.css'
import SiteChrome from '@/components/SiteChrome'
import { serverApi } from '@/lib/serverApi'
import { getImageUrl } from '@/utils/imageUtils'
import { preload } from 'react-dom'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
})


export const metadata: Metadata = {
    metadataBase: new URL('https://www.chirru.in'),
    title: { default: 'Chiranjit Das', template: '%s | Chiranjit Das' },
    description: 'Official portfolio of Chiranjit Das, Java & Backend Software Engineer specializing in Spring Boot, REST APIs, Microservices, and scalable web applications.',
    applicationName: 'Chiranjit Das Portfolio',
    authors: [{ name: 'Chiranjit Das', url: 'https://www.chirru.in/' }],
    creator: 'Chiranjit Das',
    publisher: 'Chiranjit Das',
    alternates: { canonical: 'https://www.chirru.in/' },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://www.chirru.in/',
        siteName: 'Chiranjit Das Portfolio',
        title: 'Chiranjit Das | Java & Backend Developer',
        description: 'Explore software architecture, featured projects, and backend engineering competencies by Chiranjit Das.',
        images: [{ url: 'https://www.chirru.in/og-image.jpg', width: 1200, height: 630, type: 'image/jpeg', alt: 'Chiranjit Das portfolio' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Chiranjit Das | Java & Backend Developer',
        description: 'Explore software architecture, featured projects, and backend engineering competencies by Chiranjit Das.',
        images: ['https://www.chirru.in/og-image.jpg']
    },
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon.ico', sizes: 'any' }
        ],
        apple: '/favicon.svg'
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1
        }
    },
    verification: {
        other: {
            'msvalidate.01': '3B9F498CDE61339BF4378E1368ABC695',
        },
    }
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    colorScheme: 'light dark'
}

const themeInitScript = `(function(){try{var t=localStorage.getItem('chirru_theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const [profile, socialLinks] = await Promise.all([serverApi.profile(), serverApi.socialLinks()]);
    const avatarUrl = getImageUrl(profile.imageUrl);
    if (avatarUrl) {
        preload(avatarUrl, { as: 'image', fetchPriority: 'high' });
    }
    return (
        <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
            <body>
                <SiteChrome profile={profile} socialLinks={socialLinks}>{children}</SiteChrome>
            </body>
        </html>
    )
}
