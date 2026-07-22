import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles, error } = await supabaseAdmin.from("user_roles").select("id, user_id, role");
    if (error) throw error;

    const ids = Array.from(new Set((roles ?? []).map((r) => r.user_id)));
    const emailMap: Record<string, string> = {};
    // supabase auth admin listUsers is paginated; small teams fit in one page.
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    for (const u of usersList?.users ?? []) {
      if (u.email && ids.includes(u.id)) emailMap[u.id] = u.email;
    }
    return (roles ?? []).map((r) => ({ ...r, email: emailMap[r.user_id] ?? null }));
  });

export const findUserIdByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: isMain } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "main_admin" });
    if (!isMain) throw new Error("Only main admin can transfer ownership");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = list?.users?.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
    if (!found) throw new Error("User not found. They must sign up first.");
    return { id: found.id, email: found.email };
  });
