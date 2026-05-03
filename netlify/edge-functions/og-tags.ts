import { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/lab\/([^/]+)$/);
  
  if (!match) {
    return context.next();
  }

  const slug = match[1];

  try {
    const API_URL = `${import.meta.env.VITE_API_URL}/blog/posts/${slug}`; 
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      return context.next();
    }

    const data = await response.json();
    const post = data.returnObj; 

    if (!post) {
       return context.next();
    }

    const htmlResponse = await context.next();
    const html = await htmlResponse.text();

    const title = `${post.titulo} | KSI LAB`;
    const description = post.descricao || 'Inovações, pesquisas e o futuro do desenvolvimento.';
    const keywords = post.keywords || '';
    const coverImage = post.imagem_capa || 'https://kineticsolutions.com.br/banner-kinetic-solutions-16-9.png';

    let newHtml = html;

    newHtml = newHtml.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
    newHtml = newHtml.replace(/<meta name="description" content=".*?">/i, `<meta name="description" content="${description}">`);
    
    newHtml = newHtml.replace(/<meta name="keywords" content=".*?">/i, `<meta name="keywords" content="${keywords}">`);

    newHtml = newHtml.replace(/<meta property="og:title" content=".*?">/i, `<meta property="og:title" content="${title}">`);
    newHtml = newHtml.replace(/<meta property="og:description" content=".*?">/i, `<meta property="og:description" content="${description}">`);
    newHtml = newHtml.replace(/<meta property="og:image" content=".*?">/i, `<meta property="og:image" content="${coverImage}">`);
    newHtml = newHtml.replace(/<meta property="og:url" content=".*?">/i, `<meta property="og:url" content="${url.href}">`);

    newHtml = newHtml.replace(/<meta name="twitter:title" content=".*?">/i, `<meta name="twitter:title" content="${title}">`);
    newHtml = newHtml.replace(/<meta name="twitter:description" content=".*?">/i, `<meta name="twitter:description" content="${description}">`);
    newHtml = newHtml.replace(/<meta name="twitter:image" content=".*?">/i, `<meta name="twitter:image" content="${coverImage}">`);

    return new Response(newHtml, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });

  } catch (error) {
    console.error("Erro na Edge Function:", error);
    return context.next();
  }
};