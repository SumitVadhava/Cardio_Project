// src/components/charts/ScatterPlot.tsx - Scatter plot for data exploration

'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { DataPoint } from '../../types';

interface ScatterPlotProps {
  data: DataPoint[];
  xKey: keyof DataPoint;
  yKey: keyof DataPoint;
  xLabel: string;
  yLabel: string;
}

export function ScatterPlot({ data, xKey, yKey, xLabel, yLabel }: ScatterPlotProps) {
  const colors = {
    male: '#3B82F6',
    female: '#EC4899',
    other: '#8B5CF6',
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis 
          type="number" 
          dataKey={xKey}
          name={xLabel}
          stroke="#64748B"
          tick={{ fill: '#64748B' }}
          tickLine={{ stroke: '#E2E8F0' }}
          label={{ value: xLabel, position: 'insideBottom', offset: -10, fill: '#64748B' }}
        />
        <YAxis 
          type="number" 
          dataKey={yKey}
          name={yLabel}
          stroke="#64748B"
          tick={{ fill: '#64748B' }}
          tickLine={{ stroke: '#E2E8F0' }}
          label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#64748B' }}
        />
        <ZAxis range={[60, 60]} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            color: '#1E293B',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          cursor={{ strokeDasharray: '3 3' }}
        />
        <Scatter 
          name="Data Points" 
          data={data} 
          fill="#0D9488"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          shape={(props: any) => {
            const { cx, cy, payload } = props;
            const color = colors[payload.gender as keyof typeof colors] || '#0D9488';
            return (
              <circle 
                cx={cx} 
                cy={cy} 
                r={4} 
                fill={color}
                opacity={0.7}
              />
            );
          }}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}