// Drop-in replacements for next/link and next/router that preserve the
// `lang` query param across navigations so getServerSideProps receives the
// correct language and SEO meta tags stay in sync with the UI.
import NextLink from "next/link";
import { useRouter as useNextRouter } from "next/router";
import { useSelector } from "react-redux";

const useLang = () => {
  const router = useNextRouter();
  const reduxLang = useSelector((s) => s.Language?.selectedLanguage?.code);
  return router.query.lang || reduxLang;
};

const injectLang = (url, lang) => {
  if (!lang || url == null) return url;
  if (typeof url === "string") {
    if (/[?&]lang=/.test(url)) return url;
    const [path, hash] = url.split("#");
    const sep = path.includes("?") ? "&" : "?";
    return `${path}${sep}lang=${lang}${hash ? `#${hash}` : ""}`;
  }
  if (typeof url === "object") {
    return { ...url, query: { ...(url.query || {}), lang } };
  }
  return url;
};

export const LocalizedLink = ({ href, ...props }) => {
  const lang = useLang();
  return <NextLink href={injectLang(href, lang)} {...props} />;
};

export const useLocalizedRouter = () => {
  const router = useNextRouter();
  const lang = useLang();
  return {
    ...router,
    push: (url, as, options) => router.push(injectLang(url, lang), as, options),
    replace: (url, as, options) =>
      router.replace(injectLang(url, lang), as, options),
  };
};
