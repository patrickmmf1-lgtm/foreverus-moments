import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PageData {
  type: "couple" | "friends" | "pet";
  name1: string;
  name2?: string;
  occasion?: string;
  message: string;
  startDate: Date;
  plan: string;
  photoFile?: File;
}

function generateSlug(name1: string, name2?: string): string {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const base = name2
    ? `${normalize(name1)}-e-${normalize(name2)}`
    : normalize(name1);

  // Add random suffix for uniqueness
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export function useCreatePage() {
  const [isLoading, setIsLoading] = useState(false);

  const createPage = async (data: PageData): Promise<string | null> => {
    setIsLoading(true);

    try {
      let photoUrl: string | null = null;

      // Upload photo if provided
      if (data.photoFile) {
        const fileExt = data.photoFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("couple-photos")
          .upload(fileName, data.photoFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Erro ao enviar foto. Tente novamente.");
          setIsLoading(false);
          return null;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("couple-photos")
          .getPublicUrl(uploadData.path);

        photoUrl = urlData.publicUrl;
      }

      // Generate unique slug
      const slug = generateSlug(data.name1, data.name2);

      // Insert page into database
      const { data: pageData, error: insertError } = await supabase
        .from("pages")
        .insert({
          slug,
          type: data.type,
          name1: data.name1,
          name2: data.name2 || null,
          occasion: data.occasion || null,
          message: data.message,
          start_date: data.startDate.toISOString().split("T")[0],
          photo_url: photoUrl,
          plan: data.plan,
        })
        .select("slug")
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        // If slug collision, try again with different suffix
        if (insertError.code === "23505") {
          return createPage(data); // Retry with new slug
        }
        toast.error("Erro ao criar página. Tente novamente.");
        setIsLoading(false);
        return null;
      }

      return pageData.slug;
    } catch (error) {
      console.error("Create page error:", error);
      toast.error("Erro inesperado. Tente novamente.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPage, isLoading };
}
