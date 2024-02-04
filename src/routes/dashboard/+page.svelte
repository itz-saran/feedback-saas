<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

<h1>This is a secured page</h1>
Welcome <strong>{data.user?.username}</strong>
<pre>{JSON.stringify(data, undefined, 1)}</pre>

<form method="post" action="?/signout" use:enhance>
	<button>Sign out</button>
</form>