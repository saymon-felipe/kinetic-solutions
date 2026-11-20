import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { company, privacy, terms, type LegalDoc } from '../data/legal';
import '../styles/legal.css';

function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <main className="legal-page">
      <Helmet>
        <title>{`${doc.title} | KSI - Kinetic Solutions`}</title>
        <meta name="description" content={doc.description} />
        <link rel="canonical" href={`${company.site}/${doc.slug}`} />
      </Helmet>
      <div className="legal-wrap">
        <header className="legal-header">
          <span className="legal-kicker">Documentos legais</span>
          <h1>{doc.title}</h1>
          <p className="legal-updated">Última atualização: {company.lastUpdate}</p>
          <p className="legal-intro">{doc.intro}</p>
          <nav className="legal-nav" aria-label="Documentos legais">
            <Link to={`/${privacy.slug}`} aria-current={doc.slug === 'privacidade' ? 'page' : undefined}>Política de Privacidade</Link>
            <Link to={`/${terms.slug}`} aria-current={doc.slug === 'termos' ? 'page' : undefined}>Termos de Uso</Link>
          </nav>
        </header>

        <article className="legal-body">
          {doc.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((text) => <p key={text}>{text}</p>)}
              {section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
            </section>
          ))}
        </article>

      </div>
    </main>
  );
}

export const PrivacyPolicy = () => <LegalPage doc={privacy} />;
export const TermsOfUse = () => <LegalPage doc={terms} />;
