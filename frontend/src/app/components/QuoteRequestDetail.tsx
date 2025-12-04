import React from "react";
import { useClient } from "../hooks/useClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { CreateQuoteForm } from "./CreateQuoteForm";
import type { QuoteRequestsResponse } from "../lib/pocketbase-types";

interface QuoteRequestDetailProps {
  request: QuoteRequestsResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function QuoteRequestDetail({ request, open, onOpenChange, onUpdate }: QuoteRequestDetailProps) {
  const { pb } = useClient();
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showCreateQuote, setShowCreateQuote] = React.useState(false);

  // Reset form when request changes
  React.useEffect(() => {
    if (request) {
      setRejectionReason("");
      setShowCreateQuote(false);
    }
  }, [request]);

  if (!request) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateQuote = () => {
    setShowCreateQuote(true);
  };

  const handleQuoteCreated = () => {
    onUpdate?.();
    onOpenChange(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setLoading(true);
    try {
      await pb.collection('quote_requests').update(request.id, {
        rejected: true,
        rejected_reason: rejectionReason
      });
      onUpdate?.();
      onOpenChange(false);
    } catch (err) {
      console.error('Error rejecting quote:', err);
      alert("Error rejecting quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (request.rejected) {
      return <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</span>;
    }
    if (request.completed) {
      return <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</span>;
    }
    return <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending Review</span>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Quote Request Details</DialogTitle>
          <DialogDescription>
            Review and manage this shipping quote request.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70 mb-2">Status</h3>
              {getStatusBadge()}
            </div>
            <div>
              <h3 className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70 mb-2">Request ID</h3>
              <p className="text-dark dark:text-darkmode-dark font-mono text-sm">{request.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70 mb-2">Date Created</h3>
              <p className="text-dark dark:text-darkmode-dark">{formatDate(request.created)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sender Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-dark dark:text-darkmode-dark border-b border-border dark:border-darkmode-border pb-2">
                Sender Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Name</label>
                  <p className="text-dark dark:text-darkmode-dark">
                    {request.sender_first_name && request.sender_last_name
                      ? `${request.sender_first_name} ${request.sender_last_name}`
                      : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Email</label>
                  <p className="text-dark dark:text-darkmode-dark">{request.sender_email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Phone</label>
                  <p className="text-dark dark:text-darkmode-dark">{request.sender_phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Address</label>
                  <p className="text-dark dark:text-darkmode-dark">
                    {request.sender_address ? `${request.sender_address}, ` : ''}
                    {request.sender_city ? `${request.sender_city}, ` : ''}
                    {request.sender_state ? `${request.sender_state} ` : ''}
                    {request.sender_zip_code || ''}
                    {!request.sender_address && !request.sender_city && !request.sender_state && !request.sender_zip_code && 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Recipient Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-dark dark:text-darkmode-dark border-b border-border dark:border-darkmode-border pb-2">
                Recipient Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Name</label>
                  <p className="text-dark dark:text-darkmode-dark">
                    {request.recipient_first_name && request.recipient_last_name
                      ? `${request.recipient_first_name} ${request.recipient_last_name}`
                      : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Phone</label>
                  <p className="text-dark dark:text-darkmode-dark">{request.recipient_phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Address</label>
                  <p className="text-dark dark:text-darkmode-dark">
                    {request.recipient_address_1 ? `${request.recipient_address_1}, ` : ''}
                    {request.recipient_city ? `${request.recipient_city}, ` : ''}
                    {request.recipient_state ? `${request.recipient_state} ` : ''}
                    {request.recipient_postal_code || ''}
                    {!request.recipient_address_1 && !request.recipient_city && !request.recipient_state && !request.recipient_postal_code && 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div className="mt-8 space-y-6">
            <h3 className="text-lg font-semibold text-dark dark:text-darkmode-dark border-b border-border dark:border-darkmode-border pb-2">
              Package Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Weight</label>
                <p className="text-dark dark:text-darkmode-dark">{request.weight_lbs ? `${request.weight_lbs} lbs` : 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Length</label>
                <p className="text-dark dark:text-darkmode-dark">{request.length_inches ? `${request.length_inches}"` : 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Width</label>
                <p className="text-dark dark:text-darkmode-dark">{request.width_inches ? `${request.width_inches}"` : 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Height</label>
                <p className="text-dark dark:text-darkmode-dark">{request.height_inches ? `${request.height_inches}"` : 'Not specified'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Declared Value</label>
              <p className="text-dark dark:text-darkmode-dark">
                {request.declared_value_usd ? `$${request.declared_value_usd.toFixed(2)}` : 'Not specified'}
              </p>
            </div>
            {request.delivery_instructions && (
              <div>
                <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Delivery Instructions</label>
                <p className="text-dark dark:text-darkmode-dark">{request.delivery_instructions}</p>
              </div>
            )}
          </div>

          {/* Current Quote Price or Rejection Reason */}
          {request.quote_price && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-dark dark:text-darkmode-dark border-b border-border dark:border-darkmode-border pb-2">
                Quote Information
              </h3>
              <div className="mt-4">
                <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Approved Price</label>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">${request.quote_price.toFixed(2)}</p>
              </div>
            </div>
          )}

          {request.rejected && request.rejected_reason && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-dark dark:text-darkmode-dark border-b border-border dark:border-darkmode-border pb-2">
                Rejection Information
              </h3>
              <div className="mt-4">
                <label className="text-sm font-medium text-dark/70 dark:text-darkmode-dark/70">Reason</label>
                <p className="text-red-600 dark:text-red-400">{request.rejected_reason}</p>
              </div>
            </div>
          )}

          {/* Action Section - Only show if not completed or rejected */}
          {!request.completed && !request.rejected && (
            <div className="mt-8 space-y-6">
              <h3 className="text-lg font-semibold text-dark dark:text-darkmode-dark border-b border-border dark:border-darkmode-border pb-2">
                Actions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Approve Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-green-600 dark:text-green-400">Create Quote</h4>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                      Create a detailed quote with pricing and notes for this shipping request.
                    </p>
                  </div>
                  <button
                    onClick={handleCreateQuote}
                    disabled={loading}
                    className="w-full rounded bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Create Quote
                  </button>
                </div>

                {/* Reject Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-red-600 dark:text-red-400">Reject Quote</h4>
                  <div>
                    <label className="block text-sm font-medium text-dark/70 dark:text-darkmode-dark/70 mb-2">
                      Rejection Reason
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-border bg-body px-4 py-3 text-dark focus:border-primary focus:ring-0 dark:border-darkmode-border dark:bg-darkmode-body dark:text-darkmode-dark"
                      placeholder="Enter reason for rejection"
                    />
                  </div>
                  <button
                    onClick={handleReject}
                    disabled={loading}
                    className="w-full rounded bg-red-600 px-6 py-3 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Reject Quote"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      
      {/* Create Quote Form */}
      {request && (
        <CreateQuoteForm
          request={request}
          open={showCreateQuote}
          onOpenChange={setShowCreateQuote}
          onQuoteCreated={handleQuoteCreated}
        />
      )}
    </Dialog>
  );
}