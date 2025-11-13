import React from "react";
import { useClient } from "./useClient";
import { useAuth } from "./useAuth";
import type { QuoteRequestsResponse } from "../lib/pocketbase-types";

export function useQuoteRequests() {
  const { pb } = useClient();
  const { user } = useAuth();
  const [quoteRequests, setQuoteRequests] = React.useState<QuoteRequestsResponse[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchQuoteRequests = React.useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let filter = '';
      
      // For regular users or no role, only show their own quote requests
      if (!user.role || user.role === undefined) {
        filter = `created_by = "${user.id}"`;
      }
      // For managers, show all quote requests
      // For resellers, we'll show their own for now
      else if (user.role === 'reseller') {
        filter = `created_by = "${user.id}"`;
      }
      // No filter for managers - they see everything
      
      const records = await pb.collection('quote_requests').getFullList({
        filter: filter,
        sort: '-created',
      });
      
      setQuoteRequests(records);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote requests');
      console.error('Error fetching quote requests:', err);
    } finally {
      setLoading(false);
    }
  }, [pb, user]);

  React.useEffect(() => {
    fetchQuoteRequests();
  }, [fetchQuoteRequests]);

  return {
    quoteRequests,
    loading,
    error,
    refetch: fetchQuoteRequests
  };
}