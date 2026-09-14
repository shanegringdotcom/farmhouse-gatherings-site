import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import PushPin from "@/components/board/PushPin";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address").max(255, "Email is too long"),
  dates: z.string().max(200, "Too long").optional().default(""),
  group: z.string().max(100, "Too long").optional().default(""),
  message: z.string().max(2000, "Message is too long").optional().default(""),
});

// form_submit and generate_lead are Key Events in GA4 — they count booking
// enquiries. See docs/ga4-key-events.md.
import { pushEvent, CONTACT_EMAIL, trackContactClick } from "@/lib/analytics";

const FORM_NAME = "inquiry";

// Do NOT post to "/". Measured on deploy-preview-2, every HTML path on the site
// accepts a form POST and records it — /index.html, /about, /big-long-lake,
// /__forms.html all return 200 — except the bare "/", which the `/*` catch-all
// below answers with the 404 shell. That is the single reason this form never
// delivered: the original code posted to "/".
//
// Do not add a redirect rule for this path either. A self-referential rewrite
// (`from = "/__forms.html"` → `to = "/__forms.html"`) makes it 404 instead.
const FORM_ENDPOINT = "/__forms.html";

const FORM_CONTEXT = {
  form_id: "inquiry",
  form_name: "Booking Inquiry",
  form_destination: "netlify-forms",
} as const;

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");

// Shared field chrome: underline-only inputs sitting on the notepad's ruled lines.
const fieldClass =
  "mt-1 bg-transparent border-0 border-b-2 border-[#2b2520]/25 rounded-none px-1 text-[#2b2520] placeholder:text-[#2b2520]/35 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-secondary";
const labelClass = "font-hand text-xl text-[#2b2520]/75";

const InquirySection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedRef = useRef(false);

  // Fire form_start the first time the visitor interacts with any field.
  const handleFormStart = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    pushEvent("form_start", { ...FORM_CONTEXT });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: (formData.get("name") as string) || "",
      email: (formData.get("email") as string) || "",
      dates: (formData.get("dates") as string) || "",
      group: (formData.get("group") as string) || "",
      message: (formData.get("message") as string) || "",
    };

    const result = inquirySchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSending(true);
    try {
      // Netlify Forms accepts this POST only when the deploy serving it carries
      // a detectable form definition. The 3 Aug production build did not, which
      // is why a POST to "/" there returns Netlify's "Thank you!" page with a
      // 200 and then discards the submission — a silent success that produced
      // 10 form_submit events in GA4 and zero enquiries. public/__forms.html is
      // a static file, so it is scanned on every deploy and the definition can
      // no longer go missing. bot-field is sent for field-list parity.
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": FORM_NAME, "bot-field": "", ...result.data }),
      });

      if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);

      // Conversion tracking: mark form_submit and generate_lead as Key Events in GA4.
      // These fire only on a 2xx from the Forms handler. That is the strongest
      // signal available client-side, but it is not proof of capture — if this
      // count ever diverges from the Netlify submission count again, trust
      // Netlify. scripts/leads-client.mjs in client-seo-agent reads both.
      pushEvent("form_submit", { ...FORM_CONTEXT });
      pushEvent("generate_lead", { ...FORM_CONTEXT, currency: "USD", value: 0 });

      setSubmitted(true);
      toast({ title: "Inquiry sent!", description: "We'll be in touch soon." });
    } catch {
      pushEvent("form_error", { ...FORM_CONTEXT });
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="inquire" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-lg mx-auto relative">
        {/* Spiral binding along the top of the notepad */}
        <div aria-hidden="true" className="relative z-10 flex justify-center gap-2.5 -mb-3.5 px-8">
          {Array.from({ length: 11 }).map((_, i) => (
            <span
              key={i}
              className="inline-block w-3 h-6 rounded-full border-[3px] border-[#9a9a9a] rotate-[10deg]"
            />
          ))}
        </div>

        <div
          className="bg-paper shadow-lifted px-6 sm:px-10 pt-10 pb-9"
          style={{ transform: "rotate(-0.4deg)" }}
        >
          <p
            className="font-hand text-2xl sm:text-3xl text-secondary text-center mb-1"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            leave us a note!
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2520] text-center mb-2">
            Get in Touch
          </h2>
          <p className="font-body text-[#2b2520]/50 text-center mb-10 text-base sm:text-lg">
            Tell us a little about your group.
          </p>

          {submitted ? (
            <div className="relative text-center py-12">
              <PushPin color="red" className="absolute top-2 left-1/2 -translate-x-1/2" />
              <p className="font-hand text-4xl text-[#2b2520] mb-2 pt-8">Thanks!</p>
              <p className="font-body text-[#2b2520]/60">
                We got your note. We'll be in touch soon.
              </p>
              <p className="font-body text-sm text-[#2b2520]/50 mt-6">
                Need us sooner? Email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  onClick={() => trackContactClick("email", "inquiry-confirmation")}
                  className="text-secondary underline underline-offset-4"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              name={FORM_NAME}
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              onFocus={handleFormStart}
              onChange={handleFormStart}
              className="space-y-6"
            >
              {/* Netlify Forms plumbing — required for detection + submission */}
              <input type="hidden" name="form-name" value={FORM_NAME} />
              <p className="hidden">
                <label>
                  Don&rsquo;t fill this out if you&rsquo;re human: <input name="bot-field" />
                </label>
              </p>
              <div>
                <Label htmlFor="name" className={labelClass}>Name</Label>
                <Input id="name" name="name" required placeholder="Your name" className={fieldClass} />
                {errors.name && <p className="text-[#b3402f] text-xs mt-1 font-body">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email" className={labelClass}>Email</Label>
                <Input id="email" name="email" type="email" required placeholder="Your email address" className={fieldClass} />
                {errors.email && <p className="text-[#b3402f] text-xs mt-1 font-body">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="dates" className={labelClass}>Dates</Label>
                <Input id="dates" name="dates" placeholder="When are you thinking?" className={fieldClass} />
                {errors.dates && <p className="text-[#b3402f] text-xs mt-1 font-body">{errors.dates}</p>}
              </div>
              <div>
                <Label htmlFor="group" className={labelClass}>Group Size</Label>
                <Input id="group" name="group" placeholder="How many in your crew?" className={fieldClass} />
                {errors.group && <p className="text-[#b3402f] text-xs mt-1 font-body">{errors.group}</p>}
              </div>
              <div>
                <Label htmlFor="message" className={labelClass}>Message</Label>
                <Textarea id="message" name="message" placeholder="Anything else we should know?" className={fieldClass} rows={4} />
                {errors.message && <p className="text-[#b3402f] text-xs mt-1 font-body">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={sending}
                className="relative w-full font-marker uppercase tracking-wider text-lg bg-[#b3402f] text-[#fdf6e8] py-3.5 border-2 border-[#7a2418] shadow-pinned -rotate-1 hover:rotate-0 transition-transform disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-1 border-2 border-dashed border-[#fdf6e8]/45 pointer-events-none"
                />
                {sending ? "Sending..." : "Send Inquiry"}
              </button>

              {/* The form was the only way to reach us, and nobody who started it
                  ever finished. Give people a plain email address as an out. */}
              <p className="font-body text-sm text-[#2b2520]/50 text-center pt-2">
                Or just email us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Big Long Lake farmhouse — availability")}`}
                  onClick={() => trackContactClick("email", "inquiry-form")}
                  className="text-secondary underline underline-offset-4 hover:text-secondary/80 transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default InquirySection;
