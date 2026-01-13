// src/components/charts/AccuracyChart.tsx

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AccuracyChartProps {
  data: Array<{
    date: string;
    accuracy: number;
    precision: number;
    recall: number;
  }>;
}

export function AccuracyChart({ data }: AccuracyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis 
          dataKey="date" 
          stroke="#64748B"
          tick={{ fill: '#64748B' }}
          tickLine={{ stroke: '#E2E8F0' }}
        />
        <YAxis 
          stroke="#64748B"
          tick={{ fill: '#64748B' }}
          tickLine={{ stroke: '#E2E8F0' }}
          domain={[0, 100]}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            color: '#1E293B',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(2)}%` : 'N/A'}
        />
        <Legend 
          wrapperStyle={{ color: '#1E293B' }}
        />
        <Line 
          type="monotone" 
          dataKey="accuracy" 
          stroke="#7C3AED" 
          strokeWidth={2}
          dot={{ fill: '#7C3AED', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="precision" 
          stroke="#A78BFA" 
          strokeWidth={2}
          dot={{ fill: '#A78BFA', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="recall" 
          stroke="#F59E0B" 
          strokeWidth={2}
          dot={{ fill: '#F59E0B', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}