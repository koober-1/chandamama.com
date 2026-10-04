import { t } from '@/utils/translation'
import React, { useState, useEffect } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import * as api from "@/api/apiRoutes"
import { toast } from 'react-toastify'
import { isRtl } from '@/lib/utils'


const ResetPassword = () => {

    const rtl = isRtl();
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            if (!newPassword) {
                toast.error(t("please_enter_new_password"))
                return
            }
            else if (newPassword?.length < 6) {
                toast.error(t("password_length_msg"))
                return
            }
            else if (newPassword !== confirmPassword) {
                toast.error(t("confirm_password_message"))
                return
            }
            const res = await api.resetPassword({ password: password, newPassword: newPassword, confirmPassword: confirmPassword })
            if (res.status == 1) {
                toast.success(res.message)
                setPassword("")
                setConfirmPassword("")
                setNewPassword("")
            } else {
                toast.error(res.message)
            }

        } catch (error) {
            console.log("error", error)
        }
    }

    return (
        <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
            <div className='bg-slate-50/70 border-b border-slate-100 p-5 md:p-6'>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{t("resetPassword")}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Ensure your account is using a long, random password to stay secure</p>
            </div>
            <div className='flex justify-center py-10 md:py-14 px-4'>
                <form className='w-full max-w-md' onSubmit={handleResetPassword}>
                    <div className="space-y-5">
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1"
                            >
                                {t("password")} <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder={t("please_enter_password")}
                                className="w-full rounded-xl border border-slate-200 focus:outline-none focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] py-2.5 px-4 text-sm text-slate-800 bg-slate-50/50 transition-all"
                                required
                                value={password || ""}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className={`absolute ${rtl ? "left-3" : "right-3"} top-[34px] text-slate-400 hover:text-slate-600 p-1`}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
                            </button>
                        </div>

                        <div className="relative">
                            <label
                                htmlFor="newPassword"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1"
                            >
                                {t("newPassword")} <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                name="newPassword"
                                placeholder={t("please_enter_new_password")}
                                className="w-full rounded-xl border border-slate-200 focus:outline-none focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] py-2.5 px-4 text-sm text-slate-800 bg-slate-50/50 transition-all"
                                required
                                value={newPassword || ""}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className={`absolute ${rtl ? "left-3" : "right-3"} top-[34px] text-slate-400 hover:text-slate-600 p-1`}
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
                            </button>
                        </div>

                        <div className="relative">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1"
                            >
                                {t("confirmPassword")} <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder={t("please_enter_confirm_password")}
                                className="w-full rounded-xl border border-slate-200 focus:outline-none focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] py-2.5 px-4 text-sm text-slate-800 bg-slate-50/50 transition-all"
                                required
                                value={confirmPassword || ""}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className={`absolute ${rtl ? "left-3" : "right-3"} top-[34px] text-slate-400 hover:text-slate-600 p-1`}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
                            </button>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full py-3 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-semibold text-sm shadow-md shadow-[#0BADFB]/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                            >
                                {t("change_password")}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword;