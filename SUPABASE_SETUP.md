# Setting up Supabase Storage for menu image uploads

Firebase Storage now requires the paid Blaze plan even for free-tier usage
(a Google policy change effective February 2026), so image uploads in
`admin.html` have been switched to **Supabase Storage** instead —
genuinely free, no credit card required. Everything else (the menu/offers
database, and the admin login) still runs on Firebase exactly as before;
only the image-upload part moved.

## 1. Create a free Supabase project

1. Go to https://supabase.com and sign up (email or GitHub — no card).
2. Click **New project**. Pick any name (e.g. `tyt-cafe`), set a database
   password (you won't need to remember this — it's not used here), and
   choose the region closest to Egypt (e.g. `eu-central-1` / Frankfurt).
3. Wait ~1–2 minutes while the project is provisioned.

## 2. Create the storage bucket

1. In the left sidebar of your new project, click **Storage**.
2. Click **New bucket**.
3. Name it exactly: `menu-images`
4. Toggle **Public bucket** to ON (so the café website can display the
   photos — this only allows *reading* files, not uploading).
5. Click **Create bucket**.

## 3. Allow uploads to the bucket

By default, a public bucket still blocks uploads until you add a policy.
Since this site's admin panel doesn't use Supabase's own login system
(it keeps using Firebase for admin login), the simplest working setup is
to allow uploads to this one bucket from anyone who has your public API
key — which only ever leaves your own browser when *you're* logged into
`admin.html`. Nothing else on the site (menu prices, names, categories)
can be changed this way, since those still require the Firebase admin
login to write to the database.

1. Still inside **Storage → menu-images**, click the **Policies** tab.
2. Click **New policy** → **For full customization** (or "Create a
   policy from scratch").
3. Allow `INSERT` for the `anon` role, for the `menu-images` bucket only.
   A minimal policy body:
   ```sql
   true
   ```
   (i.e. no extra restriction — any upload to this bucket is allowed).
4. Save the policy.

*(If you'd rather lock this down further later — e.g. only allow
uploads from a specific email — that needs wiring up Supabase Auth too;
ask and it can be added.)*

## 4. Get your project's URL and anon key

1. Click the **Settings** (gear icon) in the sidebar → **API**.
2. Copy the **Project URL** (looks like `https://xxxxxxxx.supabase.co`).
3. Copy the **anon public** key (a long string starting with `eyJ...`).
   This key is *meant* to be public/client-side — it's not a secret,
   same as Firebase's config keys already in this site.

## 5. Paste them into admin.html

Open `admin.html`, search for these two lines near the top of the
`<script type="module">` block:

```js
const SUPABASE_URL="PASTE_YOUR_SUPABASE_PROJECT_URL_HERE";
const SUPABASE_ANON_KEY="PASTE_YOUR_SUPABASE_ANON_PUBLIC_KEY_HERE";
```

Replace the two placeholder strings with your actual Project URL and
anon key from step 4, save, and re-deploy/re-upload `admin.html`.

## 6. Test it

Open `admin.html`, log in, and try uploading a photo for any menu item.
It should upload to Supabase and the image URL field should fill in
automatically — same flow as before, just a different storage backend
behind the scenes.
