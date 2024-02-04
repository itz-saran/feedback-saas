import { GOOGLE_OAUTH_CLIENT, GOOGLE_OAUTH_SECRET } from "$env/static/private";
import { Google } from "arctic";

export const google = new Google(
	GOOGLE_OAUTH_CLIENT,
	GOOGLE_OAUTH_SECRET,
	"http://localhost:5173/api/login/google/callback"
);
