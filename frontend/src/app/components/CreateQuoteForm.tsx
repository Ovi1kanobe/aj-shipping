import React from "react";
import { useClient } from "../hooks/useClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import type { QuoteRequestsResponse } from "../lib/pocketbase-types";

interface CreateQuoteFormProps {
  request: QuoteRequestsResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteCreated?: () => void;
}

export function CreateQuoteForm({ request, open, onOpenChange, onQuoteCreated }: CreateQuoteFormProps) {
  const { pb } = useClient();
  const [price, setPrice] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      alert("Please enter a valid quote price");
      return;
    }

    setLoading(true);
    try {
      // Create the quote
      await pb.collection('quotes').create({
        request: request.id,
        price: Number(price),
        notes: notes.trim() || undefined
      });

      // Update the quote request with the price and mark as completed
      await pb.collection('quote_requests').update(request.id, {
        quote_price: Number(price),
        completed: true
      });

      onQuoteCreated?.();
      onOpenChange(false);
      
      // Reset form
      setPrice("");
      setNotes("");
    } catch (err) {
      console.error('Error creating quote:', err);
      alert("Error creating quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setPrice("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Quote</DialogTitle>
          <DialogDescription>
            Create a shipping quote for request #{request.id.slice(0, 8)}...
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateQuote} className="space-y-6">
          {/* Request Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-dark dark:text-darkmode-dark mb-3">Request Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-dark/70 dark:text-darkmode-dark/70">From:</span>
                <p className="text-dark dark:text-darkmode-dark">
                  {request.sender_city && request.sender_state ? `${request.sender_city}, ${request.sender_state}` : 'Not specified'}
                </p>
              </div>
              <div>
                <span className="text-dark/70 dark:text-darkmode-dark/70">To:</span>
                <p className="text-dark dark:text-darkmode-dark">
                  {request.recipient_city && request.recipient_state ? `${request.recipient_city}, ${request.recipient_state}` : 'Not specified'}
                </p>
              </div>
              <div>
                <span className="text-dark/70 dark:text-darkmode-dark/70">Weight:</span>
                <p className="text-dark dark:text-darkmode-dark">{request.weight_lbs ? `${request.weight_lbs} lbs` : 'Not specified'}</p>
              </div>
              <div>
                <span className="text-dark/70 dark:text-darkmode-dark/70">Declared Value:</span>
                <p className="text-dark dark:text-darkmode-dark">
                  {request.declared_value_usd ? `$${request.declared_value_usd.toFixed(2)}` : 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Quote Price */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-darkmode-dark mb-2">
              Quote Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-white dark:bg-gray-800 px-4 py-3 text-dark dark:text-darkmode-dark focus:border-primary focus:ring-0 dark:border-darkmode-border"
              placeholder="Enter quote price (e.g., 149.99)"
              autoFocus
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-darkmode-dark mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-white dark:bg-gray-800 px-4 py-3 text-dark dark:text-darkmode-dark focus:border-primary focus:ring-0 dark:border-darkmode-border"
              placeholder="Add any additional notes about this quote (delivery time, special instructions, etc.)"
            />
          </div>

          {/* Pricing Suggestions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Pricing Suggestions</h5>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              {request.weight_lbs && (
                <p>• Based on weight ({request.weight_lbs} lbs): ~${(Number(request.weight_lbs) * 2.5).toFixed(2)}</p>
              )}
              {request.declared_value_usd && (
                <p>• Insurance fee (1% of value): ~${(request.declared_value_usd * 0.01).toFixed(2)}</p>
              )}
              <p>• Standard delivery: $25-50 base rate</p>
              <p>• Express delivery: $75-150 base rate</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 rounded-lg border border-border bg-white dark:bg-gray-800 px-6 py-3 text-dark dark:text-darkmode-dark hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 dark:border-darkmode-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !price}
              className="flex-1 rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Creating Quote..." : "Create Quote"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}