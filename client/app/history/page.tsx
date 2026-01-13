'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { ConfirmModal } from '../../components/ui/Modal';
import {
  Download,
  Trash2,
  Filter,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import {
  formatDateTime,
  getRiskColor,
  getRiskBgColor,
  downloadBlob,
} from '../../lib/utils';
import { PredictionResult } from '../../types';
import toast from 'react-hot-toast';

/* ✅ API response type */
interface PredictionHistoryResponse {
  data: PredictionResult[];
  total: number;
  hasMore: boolean;
}

export default function HistoryPage() {
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<{ riskLevel: string }>({
    riskLevel: 'all',
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  /* ✅ Typed useQuery */
  const { data, isLoading } = useQuery<PredictionHistoryResponse>({
    queryKey: ['predictions', page, filters],
    queryFn: () =>
      api.getPredictionHistory({
        page,
        limit: 10,
        riskLevel: filters.riskLevel as
          | 'low'
          | 'medium'
          | 'high'
          | 'all'
          | undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deletePrediction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success('Prediction deleted', {
        style: {
          background: '#111827',
          color: '#f8fafc',
          border: '1px solid #334155',
        },
      });
      setDeleteId(null);
    },
  });

  const handleExport = async () => {
    try {
      const blob = await api.exportHistory('csv');
      downloadBlob(blob, `predictions-${new Date().toISOString()}.csv`);
      toast.success('Export successful');
    } catch {
      toast.error('Export failed');
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Prediction History</h1>
          <p className="text-muted-foreground">
            View and manage past risk assessments
          </p>
        </div>
        <Button onClick={handleExport} icon={<Download className="h-4 w-4" />}>
          Export CSV
        </Button>
      </div>

      <Card padding="none">
        {/* Filters */}
        <div className="px-6 py-4 border-b flex items-center gap-4">
          <Filter className="h-4 w-4" />
          <select
            value={filters.riskLevel}
            onChange={(e) =>
              setFilters({ riskLevel: e.target.value })
            }
            className="px-3 py-2 rounded-md border"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="flex-1" />
          <span className="text-sm text-muted-foreground">
            {data?.total ?? 0} records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {data && data.data.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Patient</th>
                  <th className="px-6 py-4 text-left">Risk</th>
                  <th className="px-6 py-4 text-left">Level</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map(
                  (prediction: PredictionResult, index: number) => (
                    <tr key={prediction.id}>
                      <td className="px-6 py-4">
                        {formatDateTime(prediction.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        {prediction.input.age}y,{' '}
                        {prediction.input.gender}
                      </td>
                      <td className="px-6 py-4">
                        {prediction.riskScore}%
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${getRiskBgColor(
                            prediction.riskLevel
                          )} ${getRiskColor(
                            prediction.riskLevel
                          )}`}
                        >
                          {prediction.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setDeleteId(prediction.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-12 text-muted-foreground">
              No predictions found
            </p>
          )}
        </div>

        {/* Pagination */}
        {data?.hasMore && (
          <div className="p-4 text-center">
            <Button onClick={() => setPage((p) => p + 1)}>
              Load More
            </Button>
          </div>
        )}
      </Card>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() =>
          deleteId && deleteMutation.mutate(deleteId)
        }
        title="Delete Prediction"
        description="This action cannot be undone."
        loading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}



