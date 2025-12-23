import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PageData {
  id: string;
  slug: string;
  type: string;
  name1: string;
  name2: string | null;
  occasion: string | null;
  message: string;
  start_date: string;
  photo_url: string | null;
  plan: string;
  created_at: string;
  is_active: boolean;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  prompt: string;
  category: string;
  emoji: string;
  duration: number;
}

export function usePageData(slug: string | undefined) {
  const [page, setPage] = useState<PageData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Página não encontrada");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Fetch page data
      const { data: pageData, error: pageError } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (pageError) {
        console.error("Error fetching page:", pageError);
        setError("Erro ao carregar página");
        setIsLoading(false);
        return;
      }

      if (!pageData) {
        setError("Página não encontrada");
        setIsLoading(false);
        return;
      }

      setPage(pageData);

      // Fetch activities for this page type
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activities")
        .select("*")
        .eq("type", pageData.type);

      if (activitiesError) {
        console.error("Error fetching activities:", activitiesError);
      } else {
        setActivities(activitiesData || []);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [slug]);

  return { page, activities, isLoading, error };
}
