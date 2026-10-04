import enTranslation from "./en.json"
import { store } from "@/redux/store";
export const t = (label) => {
    const langObj = store.getState().Language?.selectedLanguage?.json_data;
    let langData = langObj && langObj[label];
    if (!langData && label === "faq") {
        langData = langObj?.["faqs"];
    } else if (!langData && label === "faqs") {
        langData = langObj?.["faq"];
    }
    if (langData) {
        return langData;
    } else {
        return enTranslation[label] || (label === "faq" ? enTranslation["faqs"] : undefined) || (label === "faqs" ? enTranslation["faq"] : undefined);
    }
};