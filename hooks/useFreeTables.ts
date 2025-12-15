import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export const useFreeTables = (
  selectedArea: string | null,
  date: Date,
  hour: number,
  minute: number,
  selectedTableId: number | null
) => {
  const [freeTableIds, setFreeTableIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFreeTables = useCallback(async () => {
    if (!selectedArea) return;

    setLoading(true);
    try {
      const arriveDate = date.toLocaleDateString("en-CA").split("T")[0];
      const arriveTime = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:00`;

      const { data, error } = await supabase.rpc("get_free_tables_by_floor", {
        p_floor: selectedArea,
        p_arrive_date: arriveDate,
        p_arrive_time: arriveTime,
      });

      if (error) {
        console.error("RPC get_free_tables_by_floor error:", error);
        return;
      }

      const ids = (data || []).map((t: any) => t.table_id);
      setFreeTableIds(ids);

      // Reset selected table if no longer available
      if (selectedTableId && !ids.includes(selectedTableId)) {
        // We'll return this info to parent
        return { shouldResetTable: true };
      }
    } finally {
      setLoading(false);
    }
  }, [selectedArea, date, hour, minute, selectedTableId]);

  useEffect(() => {
    loadFreeTables();
  }, [loadFreeTables]);

  return { freeTableIds, loading, reload: loadFreeTables };
};