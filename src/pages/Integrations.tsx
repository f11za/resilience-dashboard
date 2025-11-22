import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWithFallback } from '@/lib/api';
import { mockIntegrations } from '@/lib/mockData';
import { TableSkeleton } from '@/components/SkeletonLoader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function Integrations() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIntegrations = async () => {
      const data = await fetchWithFallback('/integrations', mockIntegrations);
      setIntegrations(data);
      setLoading(false);
    };
    loadIntegrations();
  }, []);

  const handleSync = (name: string) => {
    toast({
      title: 'Syncing Integration',
      description: `Refreshing ${name} connection...`,
    });
  };

  const handleConnect = (name: string) => {
    toast({
      title: 'Connecting',
      description: `Opening ${name} authentication...`,
    });
  };

  if (loading) return <TableSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connected systems and services</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{integration.name}</h3>
                    {integration.status === 'connected' ? (
                      <Badge className="gap-1 bg-status-resolved text-white">
                        <CheckCircle className="h-3 w-3" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Disconnected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last sync: {integration.lastSync}
                  </p>
                </div>

                {integration.status === 'connected' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(integration.name)}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Sync
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleConnect(integration.name)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
