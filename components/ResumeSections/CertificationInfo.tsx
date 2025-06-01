import React from "react";

interface CertificationInfoProps {
  title?: string;
  issuer?: string;
  year?: string;
  bgColor: string;
}
const CertificationInfo: React.FC<CertificationInfoProps> = ({
  title,issuer, year, bgColor,
}) => {
  return (
    <div className="mb-5">
      <h3 className={`text-[15px] font-semibold text-gray-900`}>{title}</h3>

      <div className="flex items-center gap-2">
        {year && (
          <div className="text-[11px] text-gray-800 font-bold px-3 py-0.5 inline-block rounded-lg" style={{backgroundColor: bgColor}}>{year}</div>
        )}
        <p className="text-[12px] text-gray-700 font-medium mt-1" >{issuer}</p>
      </div>
    </div>
  );
}
export default CertificationInfo;