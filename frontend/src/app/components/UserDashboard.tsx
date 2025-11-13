import React from "react";
import { useQuoteRequests } from "../hooks/useQuoteRequests";
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

interface UserDashboardProps {
  userName: string;
}

export function UserDashboard({ userName }: UserDashboardProps) {
  const { quoteRequests, loading, error } = useQuoteRequests();

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
    return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</span>;
  };

  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="mb-8">
              <h1 className="mb-2 text-h2">Welcome, {userName}!</h1>
              <p className="text-dark dark:text-darkmode-dark mb-1">Role: Regular User</p>
              <p className="text-dark/70 dark:text-darkmode-dark/70">
                Here are your shipping quote requests.
              </p>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-dark dark:text-darkmode-dark">Loading your quote requests...</p>
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
                  <TableCaption>Your shipping quote requests</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Quote Price</TableHead>
                      <TableHead>Date Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quoteRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-dark/70 dark:text-darkmode-dark/70">
                          No quote requests found. Create your first shipping request to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      quoteRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            {request.recipient_city && request.destination_country ? 
                              `${request.recipient_city}` : 'Not specified'}
                          </TableCell>
                          <TableCell>{request.weight_lbs || 'Not specified'}</TableCell>
                          <TableCell>{getStatusBadge(request)}</TableCell>
                          <TableCell>{formatPrice(request.quote_price)}</TableCell>
                          <TableCell>{formatDate(request.created)}</TableCell>
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
    </div>
  );
}