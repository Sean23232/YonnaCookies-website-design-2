import { Star } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { reviews } from "@/data/reviews";

export function Reviews() {
  // Hide the whole section when there are no reviews.
  if (reviews.length === 0) return null;

  return (
    <section aria-labelledby="reviews-title" className="relative bg-cream pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="reviews-title" eyebrow="sweet words" title="Kind Words" />
        <ul className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, index) => (
            <li key={review.id}>
              <Reveal delay={index * 0.1} className="h-full">
                <figure className="relative flex h-full flex-col rounded-3xl bg-card p-7 shadow-soft">
                  {review.isPlaceholder ? (
                    <span className="absolute right-5 top-5 rounded-full bg-butter px-3 py-1 text-xs font-bold text-cocoa">
                      Sample
                    </span>
                  ) : null}
                  <div className="flex gap-0.5 text-caramel" role="img" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: review.rating }, (_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" aria-hidden />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-cocoa">
                    “{review.text}”
                  </blockquote>
                  <figcaption className="mt-5 font-bold text-mocha">{review.name}</figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
