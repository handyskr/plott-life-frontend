import { ActionError, defineAction } from "astro:actions";

const { API_URL } = import.meta.env;

export const signOut = defineAction({
  handler: async (_, context) => {
    const token = await context.session?.get("accessToken");
    if (!token) {
      throw new ActionError({
        code: "UNAUTHORIZED",
      });
    }
    const res = await fetch(`${API_URL}/v1/user/me`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    if (!res.ok) {
      throw new ActionError({
        code: ActionError.statusToCode(res.status),
      });
    }

    context.session?.destroy();

    return {};
  },
});
