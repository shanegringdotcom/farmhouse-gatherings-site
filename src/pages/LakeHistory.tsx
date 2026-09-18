import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/board/MotionProvider";
import TornSheet from "@/components/board/TornSheet";
import PushPin from "@/components/board/PushPin";
import Tape from "@/components/board/Tape";
import StampHeading from "@/components/board/StampHeading";
import surveyMap from "@/assets/history/1925-big-long-lake-survey-map.webp";
import surveyMap1200 from "@/assets/history/1925-big-long-lake-survey-map-1200w.webp";
import milfordMap from "@/assets/history/1850-milford-township-map.webp";
import cochranPortraits from "@/assets/history/cochran-pioneers-portraits.webp";
import hartzellPortrait from "@/assets/history/hartzell-portrait-allen-noble.webp";
import hartzellChairman from "@/assets/history/hartzell-county-chairman.webp";
import owlClipping from "@/assets/history/1913-hartzell-struck-by-owl.webp";
import amusementIncorporation from "@/assets/history/amusement-company-incorporation.webp";
import amusementArticle from "@/assets/history/1926-amusement-company-article.webp";
import shadyNook from "@/assets/history/1940-shady-nook-resort.webp";

// A newspaper clipping, map, or portrait pinned to a paper page. Unlike
// Polaroid, this never crops: these are scans of text/maps, so the image
// keeps its natural aspect ratio (object-contain) and is capped at its own
// intrinsic pixel width so it's never upscaled past the source scan.
const Clipping = ({
  src,
  alt,
  caption,
  width,
  height,
  loading = "lazy",
  className = "",
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  loading?: "lazy" | "eager";
  className?: string;
}) => (
  <figure
    className={`relative bg-white p-2.5 sm:p-3 shadow-pinned mx-auto ${className}`}
    style={{ maxWidth: width }}
  >
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding={loading === "eager" ? undefined : "async"}
      className="w-full h-auto object-contain"
    />
    <figcaption className="font-body text-xs sm:text-sm leading-snug text-[#2b2520]/60 text-center pt-2.5 px-1">
      {caption}
    </figcaption>
  </figure>
);

const LakeHistory = () => {
  return (
    <>
      <Navbar />
      <MotionProvider>
        <main className="bg-corkboard">
          {/* Hero: title, intro, and the 1925 survey map as the lead image */}
          <section className="relative flex items-center justify-center px-4 sm:px-6 pt-24 pb-10 sm:pt-28">
            <div
              className="relative w-full max-w-3xl bg-paper shadow-lifted px-5 pt-8 pb-9 sm:px-10 sm:pt-10 sm:pb-11 text-center"
              style={{ transform: "rotate(-0.5deg)" }}
            >
              <p className="font-typed text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#2b2520]/55 mb-4">
                LaGrange County, Indiana
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-[#2b2520] leading-[0.95] mb-6">
                The History of Big Long Lake
              </h1>
              <p className="font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Big Long Lake lightly hides a long history. Tucked into Milford
                Township in LaGrange County, Indiana — northeast of South
                Milford and north of Kendallville — the lake has been a
                gathering place for well over 150 years, first for the farm
                families who settled its shores, then for the resort-goers who
                came to swim and dance, and now for the community of cottages
                that rings the water today.
              </p>

              <figure className="relative mt-9 max-w-[600px] mx-auto">
                <Tape className="-top-3 -left-4" rotate={-38} />
                <Tape className="-top-3 -right-4" rotate={38} />
                <img
                  src={surveyMap}
                  srcSet={`${surveyMap1200} 1189w, ${surveyMap} 2030w`}
                  sizes="(min-width: 640px) 600px, 100vw"
                  alt="1925 State of Indiana Department of Conservation blueprint survey map of Big Long Lake, LaGrange County, showing depth contours, shoreline, and topography."
                  className="w-full h-auto border-[6px] border-white shadow-pinned"
                  loading="eager"
                  width={2030}
                  height={2048}
                />
                <figcaption className="font-body text-xs sm:text-sm leading-snug text-[#2b2520]/60 text-center pt-3 px-1">
                  The 1925 State of Indiana lake survey by Indiana University
                  geology professor W. M. Tucker, charting depths and the
                  cottages of the day.
                </figcaption>
              </figure>
            </div>
          </section>

          {/* Before the cottages */}
          <section className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <StampHeading ink="pine" className="text-2xl sm:text-4xl">
                  Before the cottages: "Long Lake" and its first families
                </StampHeading>
              </div>
              <TornSheet variant="cream" rotate={0} className="px-6 py-9 sm:px-10 sm:py-11">
                <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <div className="space-y-8 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
                  <p>
                    On the earliest maps, our lake carried a simpler name:{" "}
                    <strong>Long Lake</strong>. A township map from around
                    1850 shows it sitting among familiar neighbors — Pretty
                    Lake, Pigeon River, and the little crossroads settlement
                    of Mud Corners (later renamed Mt. Pisgah) — alongside
                    long-vanished landmarks like Wier's Mill and "Col.
                    Cochran's Inn." County records suggest the community was
                    formally <strong>established around 1874</strong>, and an
                    original abstract of title from the 1800s still survives
                    for a shoreline parcel once known as Greenwood Landing.
                  </p>

                  <Clipping
                    src={milfordMap}
                    width={720}
                    height={960}
                    alt='Hand-drawn map from about 1850 of Milford Township, Indiana, labeling "Long Lake," Mud Corners, Wier&#39;s Mill, and a numbered legend of early residents including Col. Cochran&#39;s Inn.'
                    caption='A township map from about 1850 shows the lake as simply "Long Lake." Shared by Linda Burrell / Big Long Lake community.'
                  />

                  <p>
                    The land around the lake first belonged to the{" "}
                    <strong>Cochran family</strong>. William and Nancy Cochran
                    were among the area's earliest settlers, and William —
                    along with his sons and grandsons — owned much of the
                    ground here before it was ever divided into cottage lots.
                    Col. Cochran also ran a tavern, a stopping point in the
                    days of stage roads and horse travel. Local historians
                    believe <strong>Cochran's Tavern</strong> once stood near
                    the site of today's trading post; in 1969, the county
                    historical society was preparing to move and preserve the
                    old building when it burned down — possibly deliberately.
                    In those early years the lakeshore also held a mill, a
                    dam, a scattering of homes, and a small cemetery, most of
                    it near what is now the public access.
                  </p>

                  <Clipping
                    src={cochranPortraits}
                    width={1080}
                    height={1622}
                    alt="Portraits of Col. William G. Cochran (1786–1844) and Nancy McKelvey Cochran (1787–1861), pioneers of Milford Township, alongside a photograph of Charles Cochran."
                    caption="Col. William G. and Nancy McKelvey Cochran, pioneers of Milford Township. Composite shared by Dawn Riggs / Big Long Lake community."
                  />
                </div>
              </TornSheet>
            </div>
          </section>

          {/* The resort era */}
          <section className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <StampHeading className="text-2xl sm:text-4xl">
                  The resort era: Hartzell and the "pleasure resort" years
                </StampHeading>
              </div>
              <TornSheet variant="white" rotate={0} className="px-6 py-9 sm:px-10 sm:py-11">
                <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <div className="space-y-8 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
                  <p>
                    By the early twentieth century, the lake was becoming a
                    destination. The central figure of that era was{" "}
                    <strong>Lee J. Hartzell</strong>, a Fort Wayne attorney
                    who acquired land from the Cochran holdings and set about
                    selling cottage lots. One early resident left a memoir (a
                    book from the late 1800s/early 1900s written by a woman
                    named Curley) recalling how she and her husband bought a
                    lot from Hartzell — and how, each time a new cottage was
                    finished, Hartzell would mark the occasion with a chicken
                    dinner and dancing.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
                    <Clipping
                      src={hartzellPortrait}
                      width={546}
                      height={844}
                      alt="Newspaper portrait of attorney Lee J. Hartzell, who developed and sold cottage lots on Big Long Lake."
                      caption="Lee J. Hartzell, the Fort Wayne attorney who sold the early cottage lots."
                    />
                    <Clipping
                      src={hartzellChairman}
                      width={489}
                      height={960}
                      alt='Newspaper portrait of Lee J. Hartzell captioned "The New County Chairman."'
                      caption="Hartzell was a public figure in the region as well as the lake's developer."
                    />
                  </div>

                  <p>The old newspapers tell the rest of the story in vivid fragments:</p>

                  <ul className="list-disc pl-5 space-y-3">
                    <li>
                      In <strong>1908</strong>, a somber account placed early
                      campers at "Wert's Landing," on the farm of Daniel Wert
                      of South Milford — a reminder that people were already
                      pitching tents along the lake more than a century ago.
                    </li>
                    <li>
                      In <strong>1913</strong>, Hartzell himself made the news
                      under the headline "Struck by an Owl," after a hoot owl
                      flew out of a poplar tree and battered him near an
                      electric light at Lakeside.
                    </li>
                    <li>
                      In <strong>1925</strong>, a formal lake survey was
                      conducted by W. M. Tucker, a geology professor at
                      Indiana University. His blueprint map charted the
                      lake's depths, shoreline vegetation, and topography —
                      and, to the delight of history-lovers today, marked the
                      cottages that stood on the water at the time.
                    </li>
                    <li>
                      In <strong>1926</strong>, Hartzell joined George D.
                      Kingery and Mildred Beaver to incorporate the{" "}
                      <strong>Big Long Lake Amusement Company</strong>,
                      chartered to run a "pleasure resort" in LaGrange County,
                      with plans that included a lakeside bathhouse.
                    </li>
                  </ul>

                  <Clipping
                    src={owlClipping}
                    width={546}
                    height={560}
                    alt='1913 newspaper clipping headlined "Lee J. Hartzell Struck by an Owl," describing an owl attacking Hartzell near an electric light at Lakeside.'
                    caption='1913: even the lake&#39;s developer made the papers — "Lee J. Hartzell Struck by an Owl."'
                  />

                  <div className="space-y-6">
                    <Clipping
                      src={amusementIncorporation}
                      width={546}
                      height={173}
                      alt="Newspaper &quot;Incorporations&quot; notice for the Big Long Lake Amusement Company, chartered as a pleasure resort in LaGrange County by Lee J. Hartzell and partners."
                      caption='The Big Long Lake Amusement Company, chartered to run a lakeside "pleasure resort."'
                    />
                    <Clipping
                      src={amusementArticle}
                      width={545}
                      height={372}
                      alt="1926 newspaper article reporting the incorporation of the Big Long Lake Amusement Company by Lee J. Hartzell, George D. Kingery, and Mildred Beaver of Fort Wayne, with plans for a lakeside bathhouse."
                      caption="1926: incorporation papers filed in Indianapolis, with a bathhouse planned for the lake."
                    />
                  </div>

                  <p>
                    By <strong>1940</strong>, the lake was being advertised as
                    a full vacation retreat. Promotional copy for the{" "}
                    <strong>Shady Nook Resort</strong> described Big Long Lake
                    as ringed by "high banks covered with wooded groves" and
                    invited visitors to enjoy fishing, boating, bathing, and
                    dancing. The resort offered cottages for rent, a
                    campground, furnished rooms, a grocery, and a restaurant.
                    That name lives on today in the lake's Shady Nook —
                    "The Nook" — a direct thread back to the resort era.
                  </p>

                  <Clipping
                    src={shadyNook}
                    width={546}
                    height={424}
                    alt="1940 newspaper photograph of the Shady Nook Resort building on Big Long Lake, with a caption describing fishing, boating, bathing, dancing, cottages, a grocery, and a restaurant."
                    caption='The Shady Nook Resort, 1940 — fishing, boating, bathing, dancing, cottages, a grocery, and a restaurant. Today&#39;s "Nook" carries the name forward.'
                  />
                </div>
              </TornSheet>
            </div>
          </section>

          {/* A lake that has changed its shape */}
          <section className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <StampHeading ink="pine" className="text-2xl sm:text-4xl">
                  A lake that has changed its shape
                </StampHeading>
              </div>
              <TornSheet variant="kraft" rotate={0.5} className="px-6 py-8 sm:px-9">
                <PushPin color="green" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <p className="font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
                  The water itself has shifted over the generations. Longtime
                  residents remember when the lily-pad island stood well
                  above the surface as dry land — Martha Hire, on the lake
                  since 1951, recalled it as a true island. More recently, a
                  cut tree stump discovered roughly 75 feet offshore in the
                  third basin has fueled a favorite local question: was Big
                  Long Lake once considerably smaller than it is now?
                </p>
              </TornSheet>
            </div>
          </section>

          {/* A community handed down + credit */}
          <section className="py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <StampHeading className="text-2xl sm:text-4xl">
                  A community handed down
                </StampHeading>
              </div>
              <TornSheet variant="cream" rotate={-0.5} className="px-6 py-9 sm:px-10 sm:py-11 mb-10">
                <PushPin color="yellow" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <div className="space-y-5 font-body text-[#2b2520]/70 text-base sm:text-lg leading-relaxed">
                  <p>
                    The lake's story is still being written by the families
                    who call it home. When one family purchased three lots in
                    the Indianola section in <strong>1955</strong>, old
                    Native American housing stood on the prime parcel — and
                    the purchase papers were signed inside it. Other cottages
                    have stayed in the same families since the 1940s, passed
                    from one generation to the next along with the memories
                    that come with them.
                  </p>
                  <p>
                    From the Cochrans' tavern and mill, through Hartzell's
                    cottages and the resort years, to the community that
                    gathers here today, Big Long Lake has always been a place
                    people return to.
                  </p>
                </div>
              </TornSheet>

              <TornSheet variant="kraft" rotate={0.8} className="px-6 py-7 sm:px-9 max-w-xl mx-auto">
                <PushPin color="navy" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
                <p className="font-body italic text-[#2b2520]/60 text-sm sm:text-base leading-relaxed text-center">
                  This history was pieced together from research shared by
                  the Big Long Lake community — including the local history
                  work of Dawn Riggs, Linda Burrell, and Ashley Skinner —
                  drawing on period newspapers, township maps, and family
                  records. If you have old photos, documents, or stories of
                  your own, they're always welcome; the history of the lake
                  is very much a work in progress.
                </p>
              </TornSheet>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 sm:py-20 px-6 text-center">
            <TornSheet variant="white" rotate={-0.8} className="max-w-xl mx-auto px-8 py-10">
              <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2b2520] mb-4">
                Stay on Big Long Lake
              </h2>
              <p className="font-body text-[#2b2520]/60 text-base sm:text-lg mb-8">
                The Farmhouse is a lakefront rental on Big Long Lake. Read
                the{" "}
                <a
                  href="/big-long-lake"
                  className="text-[#b3402f] underline decoration-[#b3402f]/40 underline-offset-4 hover:decoration-[#b3402f] transition-colors"
                >
                  Big Long Lake guide
                </a>{" "}
                or ask us about dates.
              </p>
              <a
                href="/#inquire"
                className="relative inline-block font-marker uppercase tracking-wider text-base bg-[#b3402f] text-[#fdf6e8] px-8 py-3 border-2 border-[#7a2418] shadow-pinned -rotate-1 hover:rotate-0 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-1 border-2 border-dashed border-[#fdf6e8]/45 pointer-events-none"
                />
                Check the Big Long Lake Rental
              </a>
            </TornSheet>
          </section>
        </main>
      </MotionProvider>
      <Footer />
    </>
  );
};

export default LakeHistory;
