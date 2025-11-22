import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWithFallback, postWithFallback } from '@/lib/api';
import { mockAgentState } from '@/lib/mockData';
import { CardSkeleton } from '@/components/SkeletonLoader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Activity, AlertTriangle } from 'lucide-react';

export default function Debug() {
  const [agentState, setAgentState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgentState = async () => {
      const data = await fetchWithFallback('/agent/state', mockAgentState);
      setAgentState(data);
      setLoading(false);
    };
    loadAgentState();
  }, []);

  const handleSimulateIncident = async () => {
    await postWithFallback('/agent/simulate', { severity: 'sev2' }, { success: true });
    toast({
      title: 'Incident Simulated',
      description: 'Test incident created for agent analysis...',
    });
  };

  if (loading) return <CardSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Debug</h1>
        <p className="text-muted-foreground">Agent state and diagnostics</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Agent Status</h3>
            <Badge className="bg-status-resolved text-white">{agentState.status}</Badge>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Health</span>
              <span className="font-medium">{agentState.health}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Loop Count</span>
              <span className="font-medium">{agentState.loopCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Run</span>
              <span className="font-medium">
                {new Date(agentState.lastRun).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Task</span>
              <span className="font-medium">{agentState.currentTask}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Actions</h3>
          </div>
          
          <Button
            onClick={handleSimulateIncident}
            className="w-full"
          >
            Simulate Test Incident
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Creates a simulated SEV2 incident for testing agent responses
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Last Payload</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
          {JSON.stringify(agentState.lastPayload, null, 2)}
        </pre>
      </Card>
    </motion.div>
  );
}
