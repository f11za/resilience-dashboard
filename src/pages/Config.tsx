import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

export default function Config() {
  const [config, setConfig] = useState({
    errorRateThreshold: 5.0,
    latencyThreshold: 1000,
    autoAcknowledge: true,
    autoEscalate: false,
    notificationsEnabled: true,
    debugMode: false,
  });

  const handleSave = () => {
    toast({
      title: 'Configuration Saved',
      description: 'Settings have been updated successfully.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Configuration</h1>
        <p className="text-muted-foreground">Thresholds and feature flags</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Alert Thresholds</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="error-rate">Error Rate Threshold (%)</Label>
              <Input
                id="error-rate"
                type="number"
                value={config.errorRateThreshold}
                onChange={(e) =>
                  setConfig({ ...config, errorRateThreshold: parseFloat(e.target.value) })
                }
              />
              <p className="text-xs text-muted-foreground">
                Trigger incident when error rate exceeds this value
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="latency">Latency Threshold (ms)</Label>
              <Input
                id="latency"
                type="number"
                value={config.latencyThreshold}
                onChange={(e) =>
                  setConfig({ ...config, latencyThreshold: parseInt(e.target.value) })
                }
              />
              <p className="text-xs text-muted-foreground">
                Trigger incident when P95 latency exceeds this value
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Feature Flags</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-ack">Auto-Acknowledge</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically acknowledge low-severity incidents
                </p>
              </div>
              <Switch
                id="auto-ack"
                checked={config.autoAcknowledge}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, autoAcknowledge: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-escalate">Auto-Escalate</Label>
                <p className="text-xs text-muted-foreground">
                  Escalate if unresolved after 30 minutes
                </p>
              </div>
              <Switch
                id="auto-escalate"
                checked={config.autoEscalate}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, autoEscalate: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Send alerts to integrated channels
                </p>
              </div>
              <Switch
                id="notifications"
                checked={config.notificationsEnabled}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, notificationsEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="debug">Debug Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Enable verbose logging and diagnostics
                </p>
              </div>
              <Switch
                id="debug"
                checked={config.debugMode}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, debugMode: checked })
                }
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Configuration
        </Button>
      </div>
    </motion.div>
  );
}
