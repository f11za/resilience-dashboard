import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWithFallback, postWithFallback } from '@/lib/api';
import { mockRunbooks } from '@/lib/mockData';
import { TableSkeleton } from '@/components/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Play, Clock, CheckCircle } from 'lucide-react';

export default function Runbooks() {
  const [runbooks, setRunbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRunbooks = async () => {
      const data = await fetchWithFallback('/runbooks', mockRunbooks);
      setRunbooks(data);
      setLoading(false);
    };
    loadRunbooks();
  }, []);

  const handleRunRunbook = async (id: string, name: string) => {
    await postWithFallback(`/runbooks/${id}/execute`, {}, { success: true });
    toast({
      title: 'Runbook Executing',
      description: `${name} has been initiated...`,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      database: 'bg-chart-1 text-white',
      compute: 'bg-chart-2 text-white',
      service: 'bg-chart-3 text-white',
      cache: 'bg-chart-4 text-white',
    };
    return colors[category] || 'bg-muted';
  };

  if (loading) return <TableSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Runbooks</h1>
        <p className="text-muted-foreground">Automated recovery and remediation plans</p>
      </div>

      <div className="grid gap-4">
        {runbooks.map((runbook, index) => (
          <motion.div
            key={runbook.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{runbook.name}</h3>
                    <Badge className={getCategoryColor(runbook.category)}>
                      {runbook.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{runbook.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Avg: {runbook.avgDuration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-status-resolved" />
                      <span className="text-muted-foreground">{runbook.successRate}% success</span>
                    </div>
                    <div className="text-muted-foreground">
                      Last run: {new Date(runbook.lastRun).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleRunRunbook(runbook.id, runbook.name)}
                  className="gap-2"
                >
                  <Play className="h-4 w-4" />
                  Run
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
