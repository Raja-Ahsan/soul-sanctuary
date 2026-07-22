import { Head } from "@inertiajs/react";

export function PageMeta({
  title,
  description,
  ogTitle,
  ogDescription,
}: {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}) {
  return (
    <Head title={title}>
      <meta head-key="description" name="description" content={description} />
      <meta
        head-key="og:title"
        property="og:title"
        content={ogTitle ?? title}
      />
      <meta
        head-key="og:description"
        property="og:description"
        content={ogDescription ?? description}
      />
    </Head>
  );
}
