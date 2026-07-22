import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSettings = () =>
  useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      return data;
    },
  });

export const useServices = () =>
  useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").order("sort");
      return data ?? [];
    },
  });

export const useFaqs = () =>
  useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data } = await supabase.from("faqs").select("*").order("sort");
      return data ?? [];
    },
  });

export const useTeachers = () =>
  useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data } = await supabase.from("teachers").select("*").order("sort");
      return data ?? [];
    },
  });

export const useTeacherBySlug = (slug: string) =>
  useQuery({
    queryKey: ["teacher", slug],
    queryFn: async () => {
      const { data } = await supabase.from("teachers").select("*").eq("slug", slug).maybeSingle();
      return data;
    },
  });

export const useContacts = () =>
  useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data } = await supabase.from("contacts").select("*").order("sort");
      return data ?? [];
    },
  });
