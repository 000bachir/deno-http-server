run:
	deno run --allow-env --watch  --allow-net --env-file=.env --allow-read --allow-ffi --allow-sys  main.ts


fmt:
	deno fmt

lint:
	deno lint