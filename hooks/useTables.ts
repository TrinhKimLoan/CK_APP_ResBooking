import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Table } from "@/types/database";

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTables = async () => {
      const { data, error } = await supabase.from("tables").select("*");
      if (error || !data) {
        console.error("Error loading tables:", error);
        return;
      }

      setTables(data);
      const uniqueAreas = [...new Set(data.map((t) => t.area))];
      setAreas(uniqueAreas);
      setLoading(false);
    };

    loadTables();
  }, []);

  return { tables, areas, loading };
};