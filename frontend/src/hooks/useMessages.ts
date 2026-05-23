import { useState } from "react";
import toast from "react-hot-toast";
import { flowmindApi } from "../services/api";

export function useMessages() {
  const [loading, setLoading] = useState(false);
  const ingest = async () => {
    setLoading(true);
    try {
      const result = await flowmindApi.ingest();
      toast.success(`Cached ${result.cached} messages.`);
      return result;
    } finally {
      setLoading(false);
    }
  };
  return { ingest, loading };
}
