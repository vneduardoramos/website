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
export function AuthorBio({ author }: { author?: ArticleAuthor | null }) {
  if (!author) return null;
  const photo = author.headshot?.url ?? author.photo ?? null;

  return (
    <div className="mx-auto mt-14 max-w-3xl">
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface2 p-6 sm:flex-row sm:items-start">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={author.name}
            className="h-16 w-16 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface font-display text-lg font-bold uppercase text-muted">
            {author.name.charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
            Written by
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
              Connect on LinkedIn →
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
