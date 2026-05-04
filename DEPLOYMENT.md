# Deployment Checklist

## Local `.env`

Create a local `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
VITE_SUPABASE_REDIRECT_URL=http://localhost:5173
```

Use the project URL only. Do not use the `rest/v1` Data API URL.

## Netlify

Build settings:

- Build command: `npm run build`
- Publish directory: `dist`

The repo already includes [netlify.toml](D:\Program e-checksheet\program for AS-E-Checksheet\godot\3ACT-tool\netlify.toml:1) for SPA routing and build defaults.

Set these environment variables in Netlify:

- `VITE_SUPABASE_URL=https://your-project-ref.supabase.co`
- `VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key`
- `VITE_SUPABASE_REDIRECT_URL=https://your-site.netlify.app`

If you use a custom domain, change `VITE_SUPABASE_REDIRECT_URL` to that domain instead.

## Supabase Auth

Open `Authentication > URL Configuration` and set:

- Site URL: `https://your-site.netlify.app`

Add Redirect URLs:

- `http://localhost:5173/**`
- `https://your-site.netlify.app/**`

If you use Netlify deploy previews, also add:

- `https://**--your-site.netlify.app/**`

If you later move to a custom domain, add:

- `https://your-domain.com/**`

## API key choice

Frontend can use either:

- `anon public`
- `publishable` key

Do not use `service_role` in the frontend.

## Verify after deploy

1. Open the deployed site.
2. Confirm the auth screen appears before the editor.
3. Send a magic link.
4. Open the magic link and confirm it returns to the deployed site.
5. Create or edit a story.
6. Reload the page and confirm the story is still available.
7. Open the same account on another device and confirm the story syncs.

## Troubleshooting

If magic link sends but login returns to the wrong place:

- check `VITE_SUPABASE_REDIRECT_URL`
- check Supabase `Site URL`
- check Supabase `Redirect URLs`

If auth requests go to `/rest/v1/auth/...`, the project URL is wrong. Use:

- `https://your-project-ref.supabase.co`

not:

- `https://your-project-ref.supabase.co/rest/v1/`
