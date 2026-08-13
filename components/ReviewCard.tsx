import { Star, CheckCircle2 } from "lucide-react";

interface ReviewCardProps {
  name: string;
  rating: number;
  text: string;
  date: string;
  verified?: boolean;
}

export default function ReviewCard({ name, rating, text, date, verified = true }: ReviewCardProps) {
  return (
    <div className="flex flex-col items-start p-7 gap-[24px] w-full max-w-[420px] bg-[#FAFAF9] border border-[#F5F5F4] shadow-sm rounded-sm">
      <div className="flex flex-col w-full gap-[15px]">
        {/* Header: Name and Verified Badge */}
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row items-center gap-[4px]">
            <span className="font-poppins font-bold text-[20px] text-[#1C1917]">
              {name}
            </span>
            {verified && (
              <CheckCircle2 size={24} className="text-[#01AB31] fill-[#01AB31]/20" />
            )}
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex flex-row gap-[6px]">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              size={22}
              className={i < rating ? "fill-[#FFC633] text-[#FFC633]" : "text-[#79716B]"}
            />
          ))}
        </div>

        {/* Review Text */}
        <p className="font-poppins font-normal text-[16px] leading-[22px] text-[#79716B]">
          "{text}"
        </p>

        {/* Date */}
        <span className="font-poppins font-medium text-[16px] text-[#79716B] mt-2">
          Posted on {date}
        </span>
      </div>
    </div>
  );
}
