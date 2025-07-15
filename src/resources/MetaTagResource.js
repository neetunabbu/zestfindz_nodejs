// resources/metaTagResource.js

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().replace('.000Z', 'Z');
};

const metaTagResource = (metaTagInstance) => {
  if (!metaTagInstance) return null;

  return {
    id: metaTagInstance.id ?? null,
    path: metaTagInstance.path ?? null,
    model_id: metaTagInstance.model_id ?? null,
    model_type: metaTagInstance.model_type ?? null,
    title: metaTagInstance.title ?? null,
    keywords: metaTagInstance.keywords ?? null,
    description: metaTagInstance.description ?? null,
    h1: metaTagInstance.h1 ?? null,
    seo_text: metaTagInstance.seo_text ?? null,
    canonical: metaTagInstance.canonical ?? null,
    robots: metaTagInstance.robots ?? null,
    change_freq: metaTagInstance.change_freq ?? null,
    priority: metaTagInstance.priority ?? null,
    created_at: formatDate(metaTagInstance.created_at),
    updated_at: formatDate(metaTagInstance.updated_at),
  };
};

module.exports = metaTagResource;
