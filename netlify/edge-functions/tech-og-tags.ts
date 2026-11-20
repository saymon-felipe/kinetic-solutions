export default async (_request: Request, context: { next: () => Promise<Response> }) => {
  const response = await context.next();
  if (!response.headers.get("content-type")?.includes("text/html")) return response;

  const title = "Manutenção de computadores em Londrina | KSI TECH";
  const description = "Formatação, otimização, limpeza e reparos de computadores e notebooks em Londrina e região. Consulte atendimento em domicílio.";
  const url = "https://kineticsolutions.com.br/tech";
  const image = "https://kineticsolutions.com.br/banner-kinetic-solutions-16-9.png";
  let html = await response.text();

  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  for (const [attribute, name, value] of [
    ["name", "description", description],
    ["property", "og:title", title],
    ["property", "og:description", description],
    ["property", "og:url", url],
    ["property", "og:image", image],
    ["name", "twitter:title", title],
    ["name", "twitter:description", description],
    ["name", "twitter:image", image],
  ]) {
    html = html.replace(new RegExp(`<meta ${attribute}="${name}" content=".*?">`, "i"), `<meta ${attribute}="${name}" content="${value}">`);
  }
  html = html.replace(/<link rel="canonical" href=".*?">/i, `<link rel="canonical" href="${url}">`);

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
};
