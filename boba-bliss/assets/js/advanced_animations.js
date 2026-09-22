
// Advanced Animations Script
document.addEventListener('DOMContentLoaded', () => {
  // 1. Expanded Reveal Observer
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom').forEach((el, index) => {
    // Add staggered delay to grid items automatically
    if(el.classList.contains('product-card')) {
      el.style.transitionDelay = `${(index % 4) * 0.1}s`;
    }
    observer.observe(el);
  });

  // 2. 3D Card Tilt Effect
  const cards = document.querySelectorAll('.product-card, .split-media');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 3. View Transitions for internal links (Smooth Page Loads)
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      // Only intercept internal html links if View Transitions API is supported
      if (href && href.endsWith('.html') && !href.startsWith('http') && document.startViewTransition) {
        e.preventDefault();
        document.startViewTransition(() => {
          window.location.href = href;
        });
      }
    });
  });

  // 4. Parallax effect on Hero/Strip
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if(heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroContent.style.opacity = 1 - (scrolled * 0.003);
    }
  });


  // 5. Custom Cursor
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Smooth trailing effect
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states for cursor
  document.querySelectorAll('a, button, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // 6. Card Glow Effect (Flashlight)
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 7. Text Reveal for H1s
  document.querySelectorAll('h1').forEach(h1 => {
    // Only wrap text nodes, ignore html tags inside to prevent breaking
    if(h1.children.length === 0) {
       const text = h1.textContent;
       h1.innerHTML = '';
       const words = text.split(' ');
       words.forEach((word, idx) => {
         const spanWrap = document.createElement('span');
         spanWrap.classList.add('text-reveal');
         const spanInner = document.createElement('span');
         spanInner.textContent = word + ' ';
         spanInner.style.animationDelay = `${idx * 0.1}s`;
         spanWrap.appendChild(spanInner);
         h1.appendChild(spanWrap);
       });
    }
  });

});