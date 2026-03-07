import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <a 
          href="#home" 
          className="logo" 
          onClick={(e) => scrollToSection(e, 'home')}
        >
          <img src="/img/ksi.png" alt="Kinetic Solutions Logo" style={{ width: '70px' }} />
        </a>
        <nav>
          <ul className="nav-links">
            <li>
              <a 
                href="#servicos" 
                className="hover-target" 
                onClick={(e) => scrollToSection(e, 'servicos')}
              >
                SERVIÇOS
              </a>
            </li>
            <li>
              <a 
                href="#portfolio" 
                className="hover-target" 
                onClick={(e) => scrollToSection(e, 'portfolio')}
              >
                PORTFOLIO
              </a>
            </li>
            <li>
              <a 
                href="#sobre" 
                className="hover-target" 
                onClick={(e) => scrollToSection(e, 'sobre')}
              >
                SOBRE NÓS
              </a>
            </li>
          </ul>
        </nav>
        <a 
          href="#contato" 
          className="btn btn-primary hover-target" 
          onClick={(e) => scrollToSection(e, 'contato')}
        >
          CONTATO <i className="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </header>
  );
}