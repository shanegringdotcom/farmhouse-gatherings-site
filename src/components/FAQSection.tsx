import { useState } from "react";
import BoardPanel from "@/components/board/BoardPanel";
import StampHeading from "@/components/board/StampHeading";

// NOTE: these strings are duplicated character-for-character in index.html's
// FAQPage JSON-LD block. Change one, change both.
const faqs = [
  {
    q: "How do I book The Farmhouse at Big Long Lake?",
    a: "Send us an inquiry through the form on this page with your preferred dates and group size. We'll get back to you within 24 hours to confirm availability and share pricing details.",
  },
  {
    q: "How many guests can the property accommodate?",
    a: "The Farmhouse sleeps up to 12 guests across four bedrooms — two bunk rooms, a kids room with twin beds, and a main bedroom. There are two full bathrooms.",
  },
  {
    q: "Is Big Long Lake good for swimming and boating?",
    a: "Big Long Lake is an all-sports lake in LaGrange County, Indiana. Swimming, boating, tubing, water skiing, fishing, kayaking, and paddleboarding are all popular. The lake is roughly 300 acres with clean water and a mix of sandy and natural shoreline.",
  },
  {
    q: "What is the minimum stay requirement?",
    a: "We require a two-night minimum stay. During peak summer weekends and holidays, longer minimum stays may apply.",
  },
  {
    q: "Are pets allowed?",
    a: "No, we do not allow pets at the property. This helps us keep the home clean and comfortable for guests with allergies.",
  },
  {
    q: "What's nearby the property?",
    a: "Wolcottville is in the heart of Indiana's Amish country. Shipshewana and its famous flea market are about 15 minutes away. You'll find farm stands, local ice cream shops, and Pigeon River Fish & Wildlife Area nearby. Chain O'Lakes State Park is roughly 30 minutes south.",
  },
  {
    q: "What amenities are included?",
    a: "The Farmhouse comes with a full kitchen, dining table that seats 12, a living room with board games, central air conditioning, washer and dryer, free parking, a charcoal grill, a spacious deck with lake views, a lakefront yard with a firepit, and your own private dock on Big Long Lake.",
  },
  {
    q: "When is the best time to visit Big Long Lake?",
    a: "Summer (June through August) is peak season — warm water, long days, and the best weather for lake activities. Early fall is beautiful and quieter, with fewer boats on the water and the trees starting to turn. Late spring weekends are great for fishing and kayaking before the summer crowds arrive.",
  },
];

// The questions clipboard, hung on the wall. Accordion mechanics unchanged —
// only the chrome around the <dl> is new.
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <BoardPanel id="faq">
      <div className="text-center mb-12">
        <StampHeading ink="pine" rotate={-1} className="text-2xl sm:text-4xl">
          Common Questions
        </StampHeading>
      </div>

      <div
        className="relative max-w-2xl mx-auto bg-gradient-to-br from-[#8a5a33] to-[#6e4526] rounded-md p-3 sm:p-4 pt-8 sm:pt-9 shadow-lifted"
        style={{ transform: "rotate(0.5deg)" }}
      >
        {/* Clipboard clip */}
        <svg
          viewBox="0 0 80 26"
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 drop-shadow"
          aria-hidden="true"
        >
          <rect x="4" y="8" width="72" height="14" rx="4" fill="#a8a8a8" />
          <rect x="4" y="8" width="72" height="6" rx="3" fill="#c6c6c6" />
          <path d="M32 8 V4 a8 8 0 0 1 16 0 v4" fill="none" stroke="#9a9a9a" strokeWidth="4" />
        </svg>

        <div className="bg-[#fdfcf7] bg-paper px-5 sm:px-8 py-4">
          <dl className="space-y-0 divide-y divide-[#2b2520]/10">
            {faqs.map((faq, i) => (
              <div key={i}>
                <dt>
                  <button
                    className="w-full flex items-center justify-between py-5 text-left gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    aria-expanded={openIndex === i}
                  >
                    <span className="font-typed text-sm sm:text-base font-bold text-[#2b2520]">
                      {faq.q}
                    </span>
                    <span
                      className="flex-shrink-0 font-hand text-[#b3402f] text-2xl leading-none transition-transform duration-200"
                      style={{ transform: openIndex === i ? "rotate(45deg)" : "none" }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                </dt>
                {openIndex === i && (
                  <dd className="pb-5 font-body text-[#2b2520]/65 text-base leading-relaxed">
                    {faq.a}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </BoardPanel>
  );
};

export default FAQSection;
