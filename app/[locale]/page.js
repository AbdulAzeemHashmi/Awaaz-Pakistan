'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import VoiceInput from '../../components/VoiceInput';

export default function Home() {
    const t = useTranslations();
    const locale = useLocale();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        linkedinUrl: '',
        documentType: 'cnic',
        message: ''
    });
    const [signatureCount, setSignatureCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [appealData, setAppealData] = useState(null);

    useEffect(() => {
        fetch('/api/sign')
            .then(res => res.json())
            .then(data => setSignatureCount(data.totalSignatures || 0))
            .catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, language: locale })
            });
            const data = await response.json();
            if (data.success) {
                setSignatureCount(data.totalSignatures);
                alert('Thank you for signing! 🇵🇰');
                setFormData({ fullName: '', email: '', linkedinUrl: '', documentType: 'cnic', message: '' });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const generateAppeal = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/generate-appeal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName || 'Pakistani Professional',
                    email: formData.email || 'user@example.com',
                    documentType: formData.documentType || 'CNIC (regular, non-smart)',
                    userMessage: formData.message || 'My account was unfairly restricted.'
                })
            });
            const data = await response.json();
            if (data.success) {
                setAppealData(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('title')}
                    </h1>
                    <LanguageSwitcher currentLocale={locale} />
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    {t('subtitle')}
                </p>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                            {signatureCount}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                            {t('signatures_count')}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${Math.min((signatureCount / 10000) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{t('signature_goal')}</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('name')} *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('email')}
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('linkedin_url')}
                            </label>
                            <input
                                type="url"
                                value={formData.linkedinUrl}
                                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('document_type')}
                            </label>
                            <select
                                value={formData.documentType}
                                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                                className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="cnic">{t('document_options.cnic')}</option>
                                <option value="smart_cnic">{t('document_options.smart_cnic')}</option>
                                <option value="passport">{t('document_options.passport')}</option>
                                <option value="epassport">{t('document_options.epassport')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('message')}
                            </label>
                            <div className="flex gap-2 mt-1">
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder={t('message_placeholder')}
                                    className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                    rows="3"
                                />
                                <VoiceInput
                                    onTranscript={(text) => setFormData({ ...formData, message: text })}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? t('generating') : t('submit')}
                            </button>
                            <button
                                type="button"
                                onClick={generateAppeal}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {t('appeal')}
                            </button>
                        </div>
                    </div>
                </form>

                {appealData && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">{t('appeal_generated')}</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold">Subject:</p>
                                <p className="text-gray-700 dark:text-gray-300">{appealData.subject}</p>
                            </div>
                            <div className={locale === 'ur' ? 'rtl' : ''}>
                                <p className="font-semibold">
                                    {locale === 'ur' ? 'اردو میں اپیل' : 'Appeal (Urdu)'}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">{appealData.bodyUrdu}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Appeal (English)</p>
                                <p className="text-gray-700 dark:text-gray-300">{appealData.bodyEnglish}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Instructions:</p>
                                <p className="text-gray-700 dark:text-gray-300">{appealData.instructionsForUser}</p>
                            </div>
                        </div>
                    </div>
                )}

                <footer className="text-center text-gray-500 text-sm py-8">
                    {t('footer')}
                </footer>
            </div>
        </div>
    );
}