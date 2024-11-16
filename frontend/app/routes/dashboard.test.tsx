import { getAutoComplete } from "~/services/taskList.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  const response = await getAutoComplete({ request, query });
  return {
    users: response?.data || []
  }

};



