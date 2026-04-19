import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
}

const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'Investors Playground';
const APP_URL  = import.meta.env.VITE_APP_URL ?? '';

export function SEO({ title, description, canonical, noIndex }: Props) {
  const fullTitle = title ? `${title} · ${APP_NAME}` : APP_NAME;
  const canonicalUrl = canonical ? `${APP_URL}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex" />}
    </Helmet>
  );
}
