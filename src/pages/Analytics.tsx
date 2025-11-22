import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWithFallback } from '@/lib/api';
import { mockAnalytics } from '@/lib/mockData';
import { ChartSkeleton } from '@/components/SkeletonLoader';
import { Card } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      const data = await fetchWithFallback('/analytics', mockAnalytics);
      setAnalytics(data);
      setLoading(false);
    };
    loadAnalytics();
  }, []);

  if (loading) return <ChartSkeleton />;

  const MetricCard = ({ title, current, previous, unit, trend }: any) => (
    <Card className="p-6">
      <h3 className="text-sm text-muted-foreground mb-2">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold">{current}</span>
        <span className="text-muted-foreground mb-1">{unit}</span>
      </div>
      <div className="flex items-center gap-1 mt-2 text-sm">
        {trend === 'down' ? (
          <>
            <TrendingDown className="h-4 w-4 text-status-resolved" />
            <span className="text-status-resolved">-{((1 - current / previous) * 100).toFixed(1)}%</span>
          </>
        ) : (
          <>
            <TrendingUp className="h-4 w-4 text-status-open" />
            <span className="text-status-open">+{((current / previous - 1) * 100).toFixed(1)}%</span>
          </>
        )}
        <span className="text-muted-foreground ml-1">vs last period</span>
      </div>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Performance metrics and incident trends</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <MetricCard
          title="Mean Time to Acknowledge (MTTA)"
          current={analytics.mtta.current}
          previous={analytics.mtta.previous}
          unit="minutes"
          trend={analytics.mtta.trend}
        />
        <MetricCard
          title="Mean Time to Resolve (MTTR)"
          current={analytics.mttr.current}
          previous={analytics.mttr.previous}
          unit="minutes"
          trend={analytics.mttr.trend}
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Incident Trends (7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.incidentTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sev1" fill="hsl(var(--severity-critical))" name="SEV1" />
            <Bar dataKey="sev2" fill="hsl(var(--severity-high))" name="SEV2" />
            <Bar dataKey="sev3" fill="hsl(var(--severity-medium))" name="SEV3" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Error Rate by Service (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.errorRates} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="service" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="rate" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">P95 Latency (24h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.latencyP95}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-2))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </motion.div>
  );
}
