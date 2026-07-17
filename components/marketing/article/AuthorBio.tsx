import { getTranslations } from "next-intl/server";
import { Img as Image } from "@/components/marketing/Img";

export type ArticleAuthor = {
  name: string;
  title?: string | null;
  bio?: string | null;
  photo?: string | null;
  headshot?: { url: string } | null;
  linkedinUrl?: string | null;
};

/** End-of-article author card (photo, title, bio, LinkedIn). Renders nothing
 * when there is no author, e.g. org-bylined posts or news items. */
export async function AuthorBio({ author }: { author?: ArticleAuthor | null }) {
  if (!author) return null;
  const t = await getTranslations("articleUi");
  const photo = author.headshot?.url ?? author.photo ?? null;

  return (
    <div className="mx-auto mt-14 max-w-3xl">
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface2 p-6 sm:flex-row sm:items-start">
        {photo ? (
          <Image
            src={photo}
            alt={author.name}
            width={64}
            height={64}
            sizes="64px"
            className="h-16 w-16 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface font-display text-lg font-bold uppercase text-muted">
            {author.name.charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
            {t("authorBio.writtenBy")}
          </p>
          <p className="mt-1 font-display text-lg font-bold text-foreground">
            {author.name}
          </p>
          {author.title ? (
            <p className="text-sm text-muted">{author.title}</p>
          ) : null}
          {author.bio ? (
            <p className="mt-3 text-sm leading-relaxed text-muted">{author.bio}</p>
          ) : null}
          {author.linkedinUrl ? (
            <a
              href={author.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primaryDeep"
            >
              {t("authorBio.connectLinkedin")}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
