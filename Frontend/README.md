# Frontend

## Running the Frontend

1. Install node
2. Install pnpm
3. Inside `/Frontend` run `pnpm install` to install dependencies
4. Ensure you have a `.env` file in this folder (i.e. `/Frontend/.env`) with the relevant variables below
5. Run `pnpm dev`

You can simply rename `.example` and fill in the values you need (and for any you're unsure about, leaving them as their defaults should suffice):

| Name              | Meaning                                                            |
| ----------------- | ------------------------------------------------------------------ |
| VITE_BACKEND_PORT | The port of the frontend                                           |
| VITE_IS_DEBUG     | Whether to show the debug socket header or not (`true` or `false`) |
