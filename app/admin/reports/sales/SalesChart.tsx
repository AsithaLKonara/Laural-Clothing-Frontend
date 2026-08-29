"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SalesChartProps {
  data: any[];
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorEcom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1c1917" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#1c1917" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a8a29e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#a8a29e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
          <XAxis dataKey="date" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid #e7e5e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [`Rs. ${Number(value).toLocaleString()}`, undefined]}
          />
          <Legend iconType="circle" />
          <Area type="monotone" name="Ecommerce" dataKey="ecommerceRevenue" stroke="#1c1917" fillOpacity={1} fill="url(#colorEcom)" strokeWidth={2} activeDot={{ r: 8 }} />
          <Area type="monotone" name="POS" dataKey="posRevenue" stroke="#a8a29e" fillOpacity={1} fill="url(#colorPos)" strokeWidth={2} activeDot={{ r: 8 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
