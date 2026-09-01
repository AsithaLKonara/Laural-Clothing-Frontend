"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CustomersChartProps {
  data: any[];
}

export default function CustomersChart({ data }: CustomersChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f5f5f4" />
          <XAxis type="number" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} />
          <YAxis dataKey="name" type="category" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} width={100} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid #e7e5e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [`Rs. ${Number(value).toLocaleString()}`, 'Lifetime Spent']}
          />
          <defs>
            <linearGradient id="colorSpent" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#292524" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#1c1917" stopOpacity={1}/>
            </linearGradient>
          </defs>
          <Bar dataKey="spent" fill="url(#colorSpent)" radius={[0, 4, 4, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
