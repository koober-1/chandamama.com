import React, { useEffect, useState } from "react";
import StatusOne from "@/assets/statusIcons/status_icon_awaiting_payment.svg";
import StatusTwo from "@/assets/statusIcons/status_icon_received.svg";
import StatusThree from "@/assets/statusIcons/status_icon_process.svg";
import StatusFour from "@/assets/statusIcons/status_icon_shipped.svg";
import StatusFive from "@/assets/statusIcons/status_icon_out_for_delivery.svg";
import StatusSix from "@/assets/statusIcons/status_icon_delivered.svg";
import StatusSeven from "@/assets/statusIcons/status_icon_cancel.svg";
import StatusEight from "@/assets/statusIcons/status_icon_returned.svg";
import Image from "next/image";
import { t } from "@/utils/translation";

const OrderStepper = ({ orderDetail }) => {
  const statusMappings = {
    1: { icon: StatusOne, label: t("paymentPending") },
    2: { icon: StatusTwo, label: t("order_status_display_name_recieved") },
    3: { icon: StatusThree, label: t("processed") },
    4: { icon: StatusFour, label: t("shipped") },
    5: { icon: StatusFive, label: t("out_for_delivery") },
    6: { icon: StatusSix, label: t("order_status_display_name_delivered") },
    7: { icon: StatusSeven, label: t("cancelled") },
    9: { icon: StatusThree, label: t("order_status_display_name_recieved") },
    10: { icon: StatusTwo, label: t("ready_to_pickup") },
    11: { icon: StatusSix, label: t("picked") },
  };

  const [steps, setSteps] = useState([]);
  useEffect(() => {
    handleGetSteps();
  }, [orderDetail]);

  const handleGetSteps = () => {
    const updatedSteps = orderDetail?.status?.map(([statusCode, timestamp]) => {
      const status = statusMappings[statusCode] || {};
      return {
        icon: status.icon,
        label: `${t("your_order_has_been")} ${status.label}`,
        // timestamp: new Date(timestamp).toLocaleString("en-US", {
        //   day: "2-digit",
        //   month: "short",
        //   year: "numeric",
        //   hour: "2-digit",
        //   minute: "2-digit",
        //   hour12: true,
        // }),
        timestamp,
      };
    });
    setSteps(updatedSteps);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6">
      {steps?.map((status, index) => (
        <div key={index} className="flex items-start gap-4 mb-8 last:mb-0 relative">
          {/* Icon */}
          <div className="relative shrink-0 flex flex-col items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-emerald-600 text-white rounded-full ring-4 ring-emerald-50 shadow-xs z-10">
              <Image
                src={status?.icon?.src}
                alt="icon"
                height={18}
                width={18}
                className="h-5 w-5 object-contain invert brightness-0"
              />
            </div>
            {index < steps.length - 1 && (
              <div className="w-0.5 h-12 bg-emerald-200/80 my-1"></div>
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1 pt-1.5 min-w-0">
            <p className="font-semibold text-xs sm:text-sm text-slate-800 leading-snug">{status.label}</p>
            <p className="text-slate-400 text-xs mt-0.5">{status.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStepper;
