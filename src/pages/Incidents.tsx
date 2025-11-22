import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchWithFallback } from '@/lib/api';
import { mockIncidents } from '@/lib/mockData';
import { TableSkeleton } from '@/components/SkeletonLoader';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AlertCircle, Clock, User } from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  service: string;
  created: string;
  assignee: string;
  affectedUsers: number;
}

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadIncidents = async () => {
      const data = await fetchWithFallback<Incident[]>('/incidents', mockIncidents);
      setIncidents(data);
      setLoading(false);
    };
    loadIncidents();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'sev1':
        return 'bg-severity-critical text-white';
      case 'sev2':
        return 'bg-severity-high text-white';
      case 'sev3':
        return 'bg-severity-medium text-white';
      default:
        return 'bg-severity-low text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-status-open text-white';
      case 'acknowledged':
        return 'bg-status-acknowledged text-white';
      case 'resolved':
        return 'bg-status-resolved text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Incidents</h1>
          <p className="text-muted-foreground">Active and historical incidents</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-status-open animate-pulse" />
            {incidents.filter((i) => i.status === 'open').length} Open
          </Badge>
          <Badge variant="outline">
            {incidents.filter((i) => i.status === 'acknowledged').length} Acknowledged
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {incidents.map((incident, index) => (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="p-4 hover:shadow-lg transition-smooth cursor-pointer"
              onClick={() => navigate(`/incidents/${incident.id}`)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{incident.title}</h3>
                      <p className="text-sm text-muted-foreground">{incident.service}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(incident.created).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {incident.assignee}
                    </div>
                    {incident.affectedUsers > 0 && (
                      <div className="text-status-open font-medium">
                        {incident.affectedUsers.toLocaleString()} users affected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
