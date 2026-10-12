# GA4 Key Events Setup — Big Long Farmhouse

The inquiry form now pushes three events into the GTM `dataLayer`. This checklist
turns them into tracked conversions in GA4. You only need to do this once.

**Property:** GA4 behind GTM container `GTM-P4S84NGV`
**Events the site now sends:** `form_start`, `form_submit`, `generate_lead`, `form_error`

Each event also carries these parameters: `form_id` (`inquiry`), `form_name`
(`Booking Inquiry`), `form_destination` (`worker`), and — on
`generate_lead` — `currency` (`USD`) and `value` (`0`).

---

## Part 0 — Turn Netlify form detection back on (do this FIRST)

**This is the actual reason the enquiry count is zero.** The site's Netlify
project has `ignore_html_forms: true`, so Netlify never registered the `inquiry`
form. A `POST /` from the form returns **404**, the `fetch` in
`InquirySection.tsx` throws, the visitor sees "Something went wrong", and
`form_submit` never fires. Enquiries are not merely uncounted — they are lost.

1. **app.netlify.com → project `biglongfarmhouse` → Project configuration →
   Forms → Form detection → Enable.**
2. **Trigger a fresh deploy.** Detection is a build-time HTML scan, so the
   setting alone changes nothing until the site rebuilds.
3. Confirm the form registered: `netlify api listSiteForms --data
   '{"site_id":"b5e74645-9f14-42f1-bbef-418720c713f2"}'` should no longer
   return `[]`.
4. Submit a real test enquiry on biglongfarmhouse.com and confirm it appears
   under **Forms → inquiry**, and that the success state ("Thanks!") renders.

Only once a submission succeeds will `form_submit` / `generate_lead` reach the
dataLayer — Parts A and B below cannot work before this is fixed.

---

## Part A — Google Tag Manager (forward the events to GA4)

**Status: DONE (2026-07-27), container version 3 "Forward form events to GA4".**
Verified end to end: a real browser submission produced `form_submit` and
`generate_lead` in GA4 Realtime. What is live:

- Trigger `CE - Form Events` — Custom Event, regex
  `^(form_start|form_submit|generate_lead|form_error)$`
- Tag `GA4 Event - Form Events` — GA4 Event, `eventName = {{Event}}`,
  `measurementIdOverride = G-TCVX2100Q0`, params from the five `DLV - *` variables
- Variables `DLV - form_id`, `DLV - form_name`, `DLV - form_destination`,
  `DLV - value`, `DLV - currency`

Two things worth knowing before you touch this again:

1. **`form_start` in GA4 was never proof that GTM was wired.** It was arriving
   from GA4 Enhanced Measurement all along, while the dataLayer pushes went
   nowhere. Check for `generate_lead` instead — Enhanced Measurement cannot
   produce that one, so it only appears if GTM is forwarding.
2. **Enhanced Measurement "Form interactions" is now switched off** on stream
   `G-TCVX2100Q0`. It was double-firing `form_submit` alongside the GTM tag,
   which would have inflated the primary conversion. Leave it off: the site's own
   `form_submit` fires only on an actual HTTP 200, whereas Enhanced Measurement
   fires on any submit attempt, including ones that fail.

The steps below are the original build instructions, kept for reference.

1. Open **tagmanager.google.com** → container `GTM-P4S84NGV`.
2. Confirm there's a **GA4 Configuration tag** firing on **All Pages**. If GA4 is
   already collecting `page_view`, this exists — note its **Measurement ID**
   (`G-XXXXXXX`).
3. Create the trigger:
   - **Triggers → New → Custom Event**.
   - Event name: `form_submit|generate_lead|form_start|form_error`
   - Check **Use regex matching**.
   - Name it `CE - Form Events`. Save.
4. Create the forwarding tag:
   - **Tags → New → Google Analytics: GA4 Event**.
   - Select your GA4 config tag / Measurement ID.
   - **Event Name:** `{{Event}}` (the built-in variable — enable it under
     Variables if it isn't already). This forwards each event under its own name.
   - **Event Parameters** (Add Row for each):
     `form_id` → `{{DLV - form_id}}`, `form_name` → `{{DLV - form_name}}`,
     `form_destination` → `{{DLV - form_destination}}`, `value` → `{{DLV - value}}`,
     `currency` → `{{DLV - currency}}`.
     Create each `DLV - *` as a **Data Layer Variable** with the matching name.
   - **Trigger:** `CE - Form Events`. Save.
5. **Preview** the container (GTM Preview / Tag Assistant), load the site, submit a
   test inquiry, and confirm `form_start` fires on first field focus and both
   `form_submit` and `generate_lead` fire on a successful send.
6. **Submit / Publish** the container version.

---

## Part B — GA4 (mark them as Key Events)

Do this after GTM is publishing the events (GA4 needs to have seen an event at
least once before it appears in the list — submit a test inquiry first).

1. Open **analytics.google.com** → correct property → **Admin** (bottom left).
2. **Admin → Data display → Events.** Confirm `form_submit` and `generate_lead`
   appear in the list (may take a few minutes to hours after the first hit; use
   **Reports → Realtime** to confirm they're arriving live).
3. **Admin → Data display → Key events → Mark as key event** (or toggle the
   **Mark as key event** switch next to the event in the Events list):
   - [x] `generate_lead`  ← primary booking-enquiry conversion (done 2026-07-27)
   - [x] `form_submit`    ← secondary / backup conversion (done 2026-07-27)
   Both are set to **once per session**, so a visitor who double-submits counts
   once. Note the GA4 UI has no "create key event by name" control — it only lets
   you star events it has already seen — so these were created via the Admin API.
   - (leave `form_start` and `form_error` as standard events — useful for a
     funnel and error rate, but not conversions)
4. (Optional) **Admin → Product links → Google Ads** — if you ever run Ads, import
   `generate_lead` as a conversion there too.

---

## Part C — Confirm it's working (a day later)

- **Reports → Engagement → Events:** `form_submit` / `generate_lead` show counts.
- **Reports → Realtime:** submit a test inquiry and watch the event land within
  ~30 seconds with the right parameters.
- **Admin → Key events:** both show a ✓ and a non-zero count once real inquiries
  come in.

That closes the report's #1 issue — every booking enquiry is now counted, so the
next traffic spike won't "pass by uncounted."

---

### Notes

- `value: 0` is a placeholder. If you ever want to weight a lead (e.g. estimate an
  average booking value), change it in `src/components/InquirySection.tsx` where
  `generate_lead` is pushed, and set the same value in the GTM tag.
- Beyond Part 0, no code changes are needed — the events are already live in the
  site. Parts A and B are pure GTM + GA4 configuration.
- GTM now loads **only on `biglongfarmhouse.com`** (guard in `index.html`), so
  preview hosts no longer pollute GA4. Testing on a `*.netlify.app` or localhost
  URL will therefore show no tags firing — that is intended. Use GTM Preview
  against the live domain instead.
- The report's other half of this fix — "track the phone and email links as
  events" — has nothing to attach to yet: the marketing pages carry **no public
  phone number or email address**. The only `tel:` links are on the private
  `/welcome` guest page, which serves booked guests, not prospects. If a public
  contact number is ever added, track its clicks as `contact`.
