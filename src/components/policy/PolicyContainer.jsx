import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import BreadCrumb from '../breadcrumb/BreadCrumb';
import {
  FiShield,
  FiFileText,
  FiRotateCcw,
  FiTruck,
  FiXCircle,
  FiPrinter,
  FiArrowUp,
  FiMail,
  FiPhoneCall,
  FiCheckCircle,
  FiClock,
  FiChevronRight
} from 'react-icons/fi';
import { t } from '@/utils/translation';

const POLICY_LIST = [
  {
    id: 'terms-and-conditions',
    settingKey: 'terms_conditions',
    titleKey: 'terms_and_conditions',
    defaultTitle: 'Terms & Conditions',
    subtitle: 'Rules, terms and guidelines for using Chanda Mama services.',
    icon: FiFileText,
    path: '/terms-and-conditions',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'privacy-policy',
    settingKey: 'privacy_policy',
    titleKey: 'privacy_policy',
    defaultTitle: 'Privacy Policy',
    subtitle: 'How we collect, protect and handle your personal information.',
    icon: FiShield,
    path: '/privacy-policy',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
  },
  {
    id: 'return-and-exchange-policy',
    settingKey: 'returns_and_exchanges_policy',
    titleKey: 'returns_and_exchanges_policy',
    defaultTitle: 'Return & Exchange Policy',
    subtitle: 'Easy return policy, refund steps and exchange eligibility details.',
    icon: FiRotateCcw,
    path: '/return-and-exchange-policy',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'shipping-policy',
    settingKey: 'shipping_policy',
    titleKey: 'shipping_policy',
    defaultTitle: 'Shipping Policy',
    subtitle: 'Delivery timelines, shipping charges, tracking and logistics.',
    icon: FiTruck,
    path: '/shipping-policy',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'cancellation-policy',
    settingKey: 'cancellation_policy',
    titleKey: 'cancellation_policy',
    defaultTitle: 'Cancellation Policy',
    subtitle: 'Order cancellation rules, cutoff times and refund timelines.',
    icon: FiXCircle,
    path: '/cancellation-policy',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  },
];

const PolicyContainer = ({ activePolicyId }) => {
  const router = RouterHook();
  const setting = useSelector((state) => state?.Setting?.setting);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Find active policy config
  const currentPolicy = POLICY_LIST.find((p) => p.id === activePolicyId) || POLICY_LIST[0];
  const IconComponent = currentPolicy.icon;
  const rawHtmlContent = setting?.[currentPolicy.settingKey] || '';

  // Handle scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50/70 min-h-screen pb-16 font-sans">
      <BreadCrumb />

      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0B4F94] via-[#0BADFB] to-[#00AEEF] text-white py-12 md:py-16 shadow-lg">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-[#FDD811]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wide text-white shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FDD811] animate-pulse" />
                <span>{t('official_store_policy') || 'Official Store Policy'}</span>
                <span className="text-white/60">•</span>
                <span className="text-white/90">{t('chanda_mama_trust') || 'Chanda Mama'}</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                <span className="p-2.5 bg-white/10 rounded-2xl border border-white/20 shadow-inner">
                  <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-[#FDD811]" />
                </span>
                <span>{t(currentPolicy.titleKey) || currentPolicy.defaultTitle}</span>
              </h1>

              <p className="text-slate-100 text-sm md:text-base leading-relaxed font-medium text-white/90">
                {currentPolicy.subtitle}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl border border-white/30 transition-all shadow-sm backdrop-blur-sm active:scale-95"
                title="Print this policy"
              >
                <FiPrinter className="w-4 h-4" />
                <span>{t('print_policy') || 'Print Policy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="container mx-auto px-4 max-w-7xl mt-8 md:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Policy Navigation Sidebar (Desktop) & Top Tabs (Mobile) */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">
                  {t('all_policies') || 'All Store Policies'}
                </h3>
                
                <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0 scrollbar-none">
                  {POLICY_LIST.map((policy) => {
                    const ItemIcon = policy.icon;
                    const isActive = policy.id === activePolicyId;
                    const urlWithLang = router?.query?.lang ? `${policy.path}?lang=${router.query.lang}` : policy.path;

                    return (
                      <Link
                        key={policy.id}
                        href={urlWithLang}
                        className={`flex items-center justify-between min-w-[200px] lg:min-w-0 p-3 rounded-xl transition-all text-xs md:text-sm font-bold group ${
                          isActive
                            ? 'bg-gradient-to-r from-[#0B4F94] to-[#0BADFB] text-white shadow-md shadow-[#0BADFB]/20'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-[#0B4F94]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <ItemIcon
                            className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                              isActive ? 'text-[#FDD811]' : 'text-slate-400 group-hover:text-[#0BADFB]'
                            }`}
                          />
                          <span className="truncate">{t(policy.titleKey) || policy.defaultTitle}</span>
                        </div>
                        <FiChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isActive ? 'text-[#FDD811] translate-x-1' : 'text-slate-300 opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Customer Support Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm border border-slate-700/60 hidden lg:block space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0BADFB]/20 flex items-center justify-center text-[#0BADFB]">
                    <FiPhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                      {t('need_assistance') || 'Need Assistance?'}
                    </h4>
                    <p className="text-xs text-slate-400">We are here to help you</p>
                  </div>
                </div>

                {setting?.support_number && (
                  <a
                    href={`tel:${setting.support_number}`}
                    className="flex items-center gap-2 text-xs font-bold text-[#FDD811] hover:underline"
                  >
                    <FiPhoneCall className="w-3.5 h-3.5 shrink-0" />
                    <span>{setting.support_number}</span>
                  </a>
                )}

                {setting?.support_email && (
                  <a
                    href={`mailto:${setting.support_email}`}
                    className="flex items-center gap-2 text-xs text-slate-300 hover:text-white truncate"
                  >
                    <FiMail className="w-3.5 h-3.5 shrink-0 text-[#0BADFB]" />
                    <span className="truncate">{setting.support_email}</span>
                  </a>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content Body */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 md:p-10 relative overflow-hidden">
              
              {/* Header Badge Inside Card */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-6 mb-8">
                <div className="flex items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentPolicy.badgeColor}`}>
                    {t('chanda_mama_certified') || 'Verified Policy'}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                    <FiClock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('regularly_updated') || 'Regularly Updated'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t('active') || 'Currently Active'}</span>
                </div>
              </div>

              {/* Dynamic HTML Content Render */}
              {rawHtmlContent ? (
                <div
                  className="infoContent prose max-w-none text-slate-700 leading-relaxed text-sm md:text-base
                    [&_h1]:text-2xl [&_h1]:md:text-3xl [&_h1]:font-black [&_h1]:text-[#0B4F94] [&_h1]:border-b-2 [&_h1]:border-[#0BADFB]/20 [&_h1]:pb-3 [&_h1]:mt-6 [&_h1]:mb-4
                    [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-[#0B4F94] [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2
                    [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-5 [&_h3]:mb-2
                    [&_p]:mb-4 [&_p]:text-slate-600 [&_p]:leading-relaxed
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul]:text-slate-600
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2 [&_ol]:text-slate-600
                    [&_li]:pl-1 [&_li::marker]:text-[#0BADFB] [&_li::marker]:font-bold
                    [&_a]:text-[#0BADFB] [&_a]:font-bold [&_a]:underline hover:[&_a]:text-[#0B4F94] [&_a]:transition-colors
                    [&_strong]:text-[#0B4F94] [&_strong]:font-extrabold
                    [&_blockquote]:border-l-4 [&_blockquote]:border-[#FDD811] [&_blockquote]:bg-amber-50/60 [&_blockquote]:py-3 [&_blockquote]:px-5 [&_blockquote]:rounded-r-xl [&_blockquote]:my-6 [&_blockquote]:text-slate-700 [&_blockquote]:italic
                    [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:shadow-sm
                    [&_th]:bg-[#0B4F94] [&_th]:text-white [&_th]:p-3.5 [&_th]:text-left [&_th]:text-xs [&_th]:md:text-sm [&_th]:font-bold
                    [&_td]:p-3.5 [&_td]:border-b [&_td]:border-slate-100 [&_td]:text-xs [&_td]:md:text-sm [&_td]:text-slate-600"
                  dangerouslySetInnerHTML={{ __html: rawHtmlContent }}
                />
              ) : (
                /* Skeleton / Loading State */
                <div className="space-y-6 py-6 animate-pulse">
                  <div className="h-8 bg-slate-200 rounded-lg w-2/3" />
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-4 bg-slate-100 rounded w-11/12" />
                    <div className="h-4 bg-slate-100 rounded w-4/5" />
                  </div>
                  <div className="h-6 bg-slate-200 rounded-lg w-1/2 mt-8" />
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-4 bg-slate-100 rounded w-5/6" />
                  </div>
                </div>
              )}

              {/* Bottom Support Callout inside Content Card */}
              <div className="mt-12 pt-8 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 p-6 md:-mx-10 md:-mb-10 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-extrabold text-[#0B4F94]">
                    {t('have_questions_policy') || 'Have questions regarding this policy?'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('support_team_help') || 'Contact our dedicated support team for any queries.'}
                  </p>
                </div>

                <Link
                  href="/contact-us"
                  className="bg-[#0BADFB] hover:bg-[#0B4F94] text-white text-xs md:text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-[#0BADFB]/20 active:scale-95 shrink-0"
                >
                  {t('contact_support') || 'Contact Customer Support'}
                </Link>
              </div>

            </div>
          </main>

        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-[#0B4F94] hover:bg-[#0BADFB] text-[#FDD811] p-3.5 rounded-2xl shadow-xl transition-all duration-300 active:scale-90 border border-white/20"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};

// Helper hook for safely retrieving router query
const RouterHook = () => {
  try {
    return useRouter();
  } catch (e) {
    return { query: {} };
  }
};

export default PolicyContainer;
