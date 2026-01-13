// src/components/charts/FeatureImportance.tsx - Bar chart for feature importance

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FeatureImportanceProps {
  data: Array<{
    feature: string;
    importance: number;
  }>;
}

const COLORS = ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'];

export function FeatureImportance({ data }: FeatureImportanceProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={data} 
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis 
          type="number" 
          stroke="#64748B"
          tick={{ fill: '#64748B' }}
          tickLine={{ stroke: '#E2E8F0' }}
          domain={[0, 100]}
        />
        <YAxis 
          type="category"
          dataKey="feature" 
          stroke="#64748B"
          tick={{ fill: '#64748B' }}
          tickLine={{ stroke: '#E2E8F0' }}
          width={90}
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
          cursor={{ fill: '#F1F5F9' }}
        />
        <Bar 
          dataKey="importance" 
          radius={[0, 8, 8, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}