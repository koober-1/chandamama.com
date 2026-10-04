import React, { useEffect, useState } from 'react'
import { t } from "@/utils/translation";
import * as api from "@/api/apiRoutes"
import { Switch } from "@/components/ui/switch"
import Loader from '@/components/loader/Loader';
import { toast } from 'react-toastify';

const NotificationSetting = () => {
    const [mailSettings, setMailSettings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        handleGetApiSetting();
    }, []);

    const handleGetApiSetting = async () => {
        setLoading(true);
        try {
            const res = await api.getMailSettings();
            setMailSettings(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log("error", error)
        }
    }

    const handleToggle = (id, type, checked) => {
        const updatedSettings = mailSettings.map((item) => {
            if (item.id === id) {
                return { ...item, [type]: checked ? 1 : 0 };
            }
            return item;
        });
        setMailSettings(updatedSettings);
    }

    const handleUpdateSettings = async () => {
        setSubmitting(true);
        const status_ids = mailSettings.map((item, index) => index + 1).join(",");
        const mail_statuses = mailSettings.map((item) => item.mail_status).join(",");
        const mobile_statuses = mailSettings.map((item) => item.mobile_status).join(",");
        const sms_status = mailSettings.map((item) => item.sms_status || 0).join(",");

        try {
            const res = await api.updateMailSettings({
                status_ids,
                mail_statuses,
                mobile_statuses,
                sms_status,
            });
            toast.success(t("notification_setting_success"));
            setSubmitting(false);
        } catch (error) {
            console.log("error", error)
            setSubmitting(false);
        }
    }

    return (
        loading ? (
            <div className="py-20 flex justify-center items-center">
                <Loader />
            </div>
        ) : (
            <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
                <div className="bg-slate-50/70 border-b border-slate-100 p-5 md:p-6 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-xl md:text-2xl text-slate-900 tracking-tight">{t("notification_setting")}</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Control which channel notifications are dispatched to</p>
                    </div>
                </div>

                <div className="p-5 md:p-6">
                    <div className='flex items-center justify-end gap-10 mb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400'>
                        <span className="w-12 text-center">{t("email")}</span>
                        <span className="w-12 text-center">{t("mobileText")}</span>
                    </div>

                    <div className="space-y-3">
                        {mailSettings?.map((item) => (
                            <div key={item?.id} className='flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50/80 transition-colors'>
                                <h4 className='font-semibold text-sm md:text-base text-slate-800'>{item?.status_name}</h4>
                                <div className='flex items-center gap-10'>
                                    <div className="w-12 flex justify-center">
                                        <Switch 
                                            checked={Boolean(item.mail_status)} 
                                            onCheckedChange={(checked) => handleToggle(item.id, 'mail_status', checked)} 
                                        />
                                    </div>
                                    <div className="w-12 flex justify-center">
                                        <Switch 
                                            checked={Boolean(item.mobile_status)} 
                                            onCheckedChange={(checked) => handleToggle(item.id, 'mobile_status', checked)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            className="px-8 py-3 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-semibold text-sm shadow-md shadow-[#0BADFB]/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                            disabled={submitting}
                            onClick={handleUpdateSettings}
                        >
                            {submitting ? t("saving") : t("save")}
                        </button>
                    </div>
                </div>
            </div>
        )
    )
}

export default NotificationSetting