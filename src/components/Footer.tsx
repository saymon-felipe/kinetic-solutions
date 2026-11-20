import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container footer-content footer-grid">
        <div className="footer-info">
          <p className="footer-copy">&copy; 2026 KSI. {t('footer.rights')}</p>
          <p className="footer-company">69.925.748 SAYMON FELIPE DE LIMA</p>
          <p className="footer-company">CNPJ 69.925.748/0001-00</p>
          <p className="footer-company">Cambé/PR</p>
        </div>
        <nav className="footer-links" aria-label="Documentos legais">
          <Link to="/privacidade">Política de Privacidade</Link>
          <Link to="/termos">Termos de Uso</Link>
        </nav>
        <div className="social-links">
          <a href="https://www.linkedin.com/in/saymonflima/" target="_blank" rel="noreferrer" className="hover-target">
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a href="https://www.instagram.com/zeno_madscientist/" target="_blank" rel="noreferrer" className="hover-target">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://github.com/saymon-felipe" target="_blank" rel="noreferrer" className="hover-target">
            <i className="fa-brands fa-github"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
