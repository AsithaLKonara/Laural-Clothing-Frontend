"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PosChartProps {
  data: any[];
}

export default function PosChart({ data }: PosChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
          <XAxis dataKey="terminalName" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid #e7e5e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [`Rs. ${Number(value).toLocaleString()}`, 'Revenue']}
          />
          <defs>
            <linearGradient id="colorPosRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c1917" stopOpacity={1}/>
              <stop offset="100%" stopColor="#78716c" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <Bar dataKey="revenue" fill="url(#colorPosRevenue)" radius={[4, 4, 0, 0]} maxBarSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
