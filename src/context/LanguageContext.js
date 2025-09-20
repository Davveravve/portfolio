import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  sv: {
    // Navigation
    'nav.projects': 'Projekt',
    'nav.about': 'Om Mig',
    'nav.contact': 'Kontakt',

    // Hero Section
    'hero.scroll': 'Scrolla',

    // Projects Section
    'projects.title': 'Mina Projekt',
    'projects.subtitle': 'En samling av mina senaste skapelser',
    'projects.uncategorized': 'Okategoriserad',
    'projects.noDescription': 'Ingen beskrivning tillgänglig',
    'projects.noProjects': 'Inga projekt att visa',

    // About Modal
    'about.title': 'Om Mig',
    'about.subtitle': 'Utvecklare & Designer med passion för innovation',
    'about.loading': 'Laddar...',
    'about.skills.title': 'Tekniska Färdigheter',

    // Contact Modal
    'contact.title': 'Kontakta Mig',
    'contact.subtitle': 'Låt oss diskutera ditt nästa projekt',
    'contact.form.name': 'Namn',
    'contact.form.email': 'E-post',
    'contact.form.message': 'Meddelande',
    'contact.form.placeholder': 'Berätta om ditt projekt eller säg bara hej!',
    'contact.form.submit': 'Skicka Meddelande',
    'contact.form.sending': 'Skickar...',
    'contact.toast.title': 'Meddelande Skickat!',
    'contact.toast.message': 'Jag återkommer snart',

    // Action Buttons
    'actions.about.title': 'Om Mig',
    'actions.about.subtitle': 'Lär känna mig bättre',
    'actions.contact.title': 'Kontakt',
    'actions.contact.subtitle': 'Låt oss prata projekt',

    // Admin specific (these won't change in public view)
    'admin.projects': 'Projekt',
    'admin.categories': 'Kategorier',
    'admin.about': 'Om Mig',
    'admin.settings': 'Inställningar',
    'admin.messages': 'Meddelanden'
  },
  en: {
    // Navigation
    'nav.projects': 'Projects',
    'nav.about': 'About Me',
    'nav.contact': 'Contact',

    // Hero Section
    'hero.scroll': 'Scroll',

    // Projects Section
    'projects.title': 'My Projects',
    'projects.subtitle': 'A collection of my recent creations',
    'projects.uncategorized': 'Uncategorized',
    'projects.noDescription': 'No description available',
    'projects.noProjects': 'No projects to display',

    // About Modal
    'about.title': 'About Me',
    'about.subtitle': 'Developer & Designer with a passion for innovation',
    'about.loading': 'Loading...',
    'about.skills.title': 'Technical Skills',

    // Contact Modal
    'contact.title': 'Contact Me',
    'contact.subtitle': 'Let\'s discuss your next project',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.placeholder': 'Tell me about your project or just say hello!',
    'contact.form.submit': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.toast.title': 'Message Sent!',
    'contact.toast.message': 'I\'ll get back to you soon',

    // Action Buttons
    'actions.about.title': 'About Me',
    'actions.about.subtitle': 'Get to know me better',
    'actions.contact.title': 'Contact',
    'actions.contact.subtitle': 'Let\'s talk projects',

    // Admin specific (these won't change in public view)
    'admin.projects': 'Projects',
    'admin.categories': 'Categories',
    'admin.about': 'About Me',
    'admin.settings': 'Settings',
    'admin.messages': 'Messages'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'sv';
  });

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'sv' ? 'en' : 'sv');
  };

  const t = (key, fallback = key) => {
    return translations[currentLanguage]?.[key] || fallback;
  };

  const value = {
    currentLanguage,
    setCurrentLanguage,
    toggleLanguage,
    t,
    isSwedish: currentLanguage === 'sv',
    isEnglish: currentLanguage === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};