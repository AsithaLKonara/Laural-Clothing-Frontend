"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ['#1c1917', '#44403c', '#78716c', '#a8a29e', '#d6d3d1', '#f5f5f4'];

interface PaymentsChartProps {
  data: any[];
}

export default function PaymentsChart({ data }: PaymentsChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
            dataKey="revenue"
            nameKey="method"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [`Rs. ${Number(value).toLocaleString()}`, "Revenue"]}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e7e5e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
