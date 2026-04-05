"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AdminRevenueChartItem = {
  period: string;
  totalRevenue: number;
  totalBookings: number;
  percent: number;
};

type AdminRevenueChartProps = {
  data: AdminRevenueChartItem[];
};

const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

export function AdminRevenueChart({ data }: AdminRevenueChartProps) {
  const highlighted = data.reduce<AdminRevenueChartItem | null>((best, item) => {
    if (!best || item.totalRevenue > best.totalRevenue) {
      return item;
    }

    return best;
  }, null);

  return (
    <div className="grid grid-cols-[42px_minmax(0,1fr)] gap-3">
      <div className="flex h-[260px] flex-col justify-between pb-8 pt-1 text-[11px] font-medium text-slate-400">
        <span>100%</span>
        <span>80%</span>
        <span>60%</span>
        <span>40%</span>
        <span>20%</span>
        <span>0%</span>
      </div>

      <div className="h-[292px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 24 }}>
            <defs>
              <linearGradient id="adminRevenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f83ff" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#4f83ff" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#e6ebf3" />
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
            />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 16px 32px rgba(15, 23, 42, 0.08)",
              }}
              formatter={(value, name) => {
                const numericValue = typeof value === "number" ? value : Number(value ?? 0);

                if (name === "percent") {
                  return [`${numericValue}%`, "Tỷ lệ"];
                }

                if (name === "totalRevenue") {
                  return [formatCurrency(numericValue), "Doanh thu"];
                }

                return [numericValue, "Đơn hàng"];
              }}
              labelFormatter={(label) => `Ngày ${label}`}
            />
            <Area
              type="monotone"
              dataKey="percent"
              stroke="#4f83ff"
              strokeWidth={3}
              fill="url(#adminRevenueFill)"
              dot={{ r: 3.5, strokeWidth: 2, stroke: "#4f83ff", fill: "#ffffff" }}
              activeDot={{ r: 5, strokeWidth: 3, stroke: "#4f83ff", fill: "#4f83ff" }}
            />
            {highlighted ? (
              <ReferenceDot
                x={highlighted.period}
                y={highlighted.percent}
                r={0}
                ifOverflow="extendDomain"
                label={{
                  value: `${highlighted.percent}%`,
                  position: "top",
                  fill: "#ffffff",
                  fontSize: 10,
                  fontWeight: 700,
                }}
                shape={(props: { cx?: number; cy?: number }) => {
                  const cx = props.cx ?? 0;
                  const cy = props.cy ?? 0;

                  return (
                    <g>
                      <rect x={cx - 34} y={cy - 34} width="68" height="22" rx="6" fill="#4f83ff" />
                    </g>
                  );
                }}
              />
            ) : null}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
