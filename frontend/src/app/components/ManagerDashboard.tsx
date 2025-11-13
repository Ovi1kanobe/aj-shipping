import React from "react";
import { useQuoteRequests } from "../hooks/useQuoteRequests";
import { QuoteRequestDetail } from "./QuoteRequestDetail";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import type { QuoteRequestsResponse } from "../lib/pocketbase-types";

interface ManagerDashboardProps {
  userName: string;
}

export function ManagerDashboard({ userName }: ManagerDashboardProps) {
  const { quoteRequests, loading, error, refetch } = useQuoteRequests();
  const [selectedRequest, setSelectedRequest] = React.useState<QuoteRequestsResponse | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return 'Pending';
    return `$${price.toFixed(2)}`;
  };

  const getStatusBadge = (request: QuoteRequestsResponse) => {
    if (request.rejected) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</span>;
    }
    if (request.completed) {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending Approval</span>;
  };

  const handleReviewRequest = (request: QuoteRequestsResponse) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedRequest(null);
    }
  };

  const handleRequestUpdate = () => {
    refetch();
  };

  const pendingRequests = quoteRequests.filter(req => !req.completed && !req.rejected);

  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="mb-8">
              <h1 className="mb-2 text-h2">Welcome, {userName}!</h1>
              <p className="text-dark dark:text-darkmode-dark mb-1">Role: Manager</p>
              <p className="text-dark/70 dark:text-darkmode-dark/70">
                Manage and approve shipping quote requests.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-lg bg-theme-light p-6 shadow-lg dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border">
                <h3 className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70 mb-2">
                  Total Requests
                </h3>
                <div className="text-2xl font-bold text-dark dark:text-darkmode-dark">{quoteRequests.length}</div>
              </div>
              
              <div className="rounded-lg bg-theme-light p-6 shadow-lg dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border">
                <h3 className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70 mb-2">
                  Pending Approval
                </h3>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingRequests.length}</div>
              </div>
              
              <div className="rounded-lg bg-theme-light p-6 shadow-lg dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border">
                <h3 className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70 mb-2">
                  Completed
                </h3>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {quoteRequests.filter(req => req.completed).length}
                </div>
              </div>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-dark dark:text-darkmode-dark">Loading quote requests...</p>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded bg-red-100 px-4 py-3 text-red-700 dark:bg-red-900 dark:text-red-200">
                Error: {error}
              </div>
            )}

            {!loading && !error && (
              <div className="rounded-lg bg-theme-light shadow-lg dark:bg-darkmode-theme-light border border-border dark:border-darkmode-border overflow-hidden">
                <Table>
                  <TableCaption>All shipping quote requests requiring approval</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Quote Price</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quoteRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-dark/70 dark:text-darkmode-dark/70">
                          No quote requests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      quoteRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            {request.sender_first_name && request.sender_last_name
                              ? `${request.sender_first_name} ${request.sender_last_name}`
                              : request.sender_email || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {request.recipient_city ? 
                              `${request.recipient_city}` : 'Not specified'}
                          </TableCell>
                          <TableCell>{request.weight_lbs || 'Not specified'}</TableCell>
                          <TableCell>{getStatusBadge(request)}</TableCell>
                          <TableCell>{formatPrice(request.quote_price)}</TableCell>
                          <TableCell>{formatDate(request.created)}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleReviewRequest(request)}
                              className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
                            >
                              Review
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote Request Detail Modal */}
      <QuoteRequestDetail
        request={selectedRequest}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        onUpdate={handleRequestUpdate}
      />
    </div>
  );
}