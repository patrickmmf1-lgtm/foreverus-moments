import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateImages } from "@/utils/imageValidation";

// Test mode - TEMPORARILY ENABLED for testing
const TEST_MODE = true;

interface PageData {
  type: "couple" | "friends" | "pet";
  name1: string;
  name2?: string;
  occasion?: string;
  message: string;
  startDate: Date;
  plan: string;
  photoFiles?: File[];
  customerEmail?: string;
}

interface CreatePageResult {
  slug: string;
  checkoutUrl: string;
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

  const createPage = async (data: PageData): Promise<CreatePageResult | null> => {
    setIsLoading(true);

    try {
      const photoUrls: string[] = [];

      // Upload photos if provided
      if (data.photoFiles && data.photoFiles.length > 0) {
        // Validar imagens antes do upload
        const validationResult = validateImages(data.photoFiles);
        if (!validationResult.isValid) {
          toast.error(validationResult.error);
          setIsLoading(false);
          return null;
        }
        
        for (const file of data.photoFiles) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("couple-photos")
            .upload(fileName, file, {
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

          photoUrls.push(urlData.publicUrl);
        }
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
          photo_url: photoUrls[0] || null,
          photos: photoUrls.length > 0 ? photoUrls : null,
          plan: data.plan,
          status: 'pending_payment', // Always pending - database enforces this via RLS
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

      // Em modo de teste, pular o pagamento
      if (TEST_MODE) {
        return {
          slug: pageData.slug,
          checkoutUrl: `/sucesso?slug=${pageData.slug}`,
        };
      }

      // Call create-billing edge function to get checkout URL
      const { data: billingData, error: billingError } = await supabase.functions.invoke(
        'create-billing',
        {
          body: {
            slug: pageData.slug,
            plan: data.plan,
            customerEmail: data.customerEmail,
          },
        }
      );

      if (billingError) {
        console.error("Billing error:", billingError);
        toast.error("Erro ao gerar pagamento. Tente novamente.");
        setIsLoading(false);
        return null;
      }

      if (!billingData?.checkoutUrl) {
        console.error("No checkout URL returned:", billingData);
        toast.error("Erro ao gerar link de pagamento.");
        setIsLoading(false);
        return null;
      }

      return {
        slug: pageData.slug,
        checkoutUrl: billingData.checkoutUrl,
      };
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
