import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

const locales = ['en', 'ur'];

export default async function LocaleLayout({ children, params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) {
        notFound();
    }

    let messages;
    try {
        messages = (await import(`../../../messages/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    const isRTL = locale === 'ur';

    return (
        <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
