import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutFounder from './components/AboutFounder';
import Portfolio from './components/Portfolio';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';

export default function App() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <AboutFounder />
        <Services />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}