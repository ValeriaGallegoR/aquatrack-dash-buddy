import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization")!;
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user: caller }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Check caller is admin
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: admin role required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, ...params } = await req.json();

    // LIST all users
    if (action === "list_users") {
      const { data: profiles } = await adminClient
        .from("profiles")
        .select("id, username, email, created_at, is_active")
        .order("created_at", { ascending: true });

      // Get roles for all users
      const { data: roles } = await adminClient
        .from("user_roles")
        .select("user_id, role");

      const rolesMap: Record<string, string[]> = {};
      (roles || []).forEach((r: any) => {
        if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
        rolesMap[r.user_id].push(r.role);
      });

      const users = (profiles || []).map((p: any) => ({
        ...p,
        roles: rolesMap[p.id] || ["user"],
        is_admin: (rolesMap[p.id] || []).includes("admin"),
      }));

      return new Response(JSON.stringify({ users }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // UPDATE user profile
    if (action === "update_user") {
      const { user_id, username, email } = params;
      const { error } = await adminClient
        .from("profiles")
        .update({ username, email })
        .eq("id", user_id);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // TOGGLE active status
    if (action === "toggle_active") {
      const { user_id, is_active } = params;
      // Prevent deactivating self
      if (user_id === caller.id) {
        return new Response(JSON.stringify({ error: "Cannot deactivate yourself" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await adminClient
        .from("profiles")
        .update({ is_active })
        .eq("id", user_id);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // TOGGLE admin role
    if (action === "toggle_admin") {
      const { user_id, make_admin } = params;
      if (user_id === caller.id) {
        return new Response(JSON.stringify({ error: "Cannot change your own admin role" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (make_admin) {
        await adminClient.from("user_roles").upsert(
          { user_id, role: "admin" },
          { onConflict: "user_id,role" }
        );
      } else {
        await adminClient.from("user_roles").delete()
          .eq("user_id", user_id)
          .eq("role", "admin");
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE user
    if (action === "delete_user") {
      const { user_id } = params;
      if (user_id === caller.id) {
        return new Response(JSON.stringify({ error: "Cannot delete yourself" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await adminClient.auth.admin.deleteUser(user_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET user detail with sensors
    if (action === "get_user_detail") {
      const { user_id } = params;
      const { data: profile } = await adminClient
        .from("profiles")
        .select("*")
        .eq("id", user_id)
        .single();

      const { data: sensors } = await adminClient
        .from("sensors")
        .select("*")
        .eq("user_id", user_id);

      const { data: roles } = await adminClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user_id);

      return new Response(JSON.stringify({
        profile,
        sensors: sensors || [],
        roles: (roles || []).map((r: any) => r.role),
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
