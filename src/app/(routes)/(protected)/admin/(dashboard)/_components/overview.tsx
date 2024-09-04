"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';

import { formatAmount } from '@/lib/utils';

interface OverviewProps {
  items: { month: string; revenue: number }[];
}

export default function Overview({ items }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={items}>
        <Bar
          dataKey="revenue"
          barSize={20}
          fill="#99c620"
          radius={[4, 4, 0, 0]}
        />
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={(props) => <CustomTooltip {...props} />}
          cursor={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface CustomTooltipProps extends TooltipProps<any, any> {
  active?: boolean;
  payload?: Payload<any, any>[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-xl">
        <p>
          {label} :{" "}
          <span className="text-primary">{formatAmount(payload[0].value)}</span>
        </p>
      </div>
    );
  }

  return null;
}
