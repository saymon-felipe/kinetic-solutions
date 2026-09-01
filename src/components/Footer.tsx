import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container footer-content">
        <p>&copy; 2026 KSI. {t('footer.rights')}</p>
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
