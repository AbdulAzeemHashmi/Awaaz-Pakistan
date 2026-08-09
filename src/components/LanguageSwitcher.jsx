'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher({ currentLocale }) {
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = (locale) => {
        const newPath = `/${locale}${pathname.replace(/^\/[a-z]{2}/, '')}`;
        router.push(newPath);
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 rounded ${currentLocale === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
                English
            </button>
            <button
                onClick={() => switchLanguage('ur')}
                className={`px-3 py-1 rounded ${currentLocale === 'ur' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
                اردو
            </button>
        </div>
    );
}