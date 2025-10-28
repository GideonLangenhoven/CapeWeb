// src/services.js

export function setupServiceCards() {
  document.querySelectorAll('#product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('animate');
      card.querySelectorAll('div.carouselNext, div.carouselPrev').forEach(el => el.classList.add('visible'));
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('animate');
      card.querySelectorAll('div.carouselNext, div.carouselPrev').forEach(el => el.classList.remove('visible'));
    });
  });

  document.querySelectorAll('.view_details').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('#product-card');
      card.classList.add('flip-10');
      setTimeout(() => {
        card.classList.remove('flip-10');
        card.classList.add('flip90');
        card.querySelector('div.shadow').style.display = 'block';
        card.querySelector('div.shadow').style.opacity = '1';
        setTimeout(() => {
          card.querySelector('#product-front').style.display = 'none';
        }, 80);
      }, 50);

      setTimeout(() => {
        card.classList.remove('flip90');
        card.classList.add('flip190');
        card.querySelector('#product-back').style.display = 'block';
        setTimeout(() => {
          card.classList.remove('flip190');
          card.classList.add('flip180');
        }, 100);
      }, 150);
    });
  });

  document.querySelectorAll('#flip-back').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('#product-card');
      // Reverse flip animation
    });
  });

  // Modal logic
  const modal = document.getElementById('service-modal');
  const closeBtn = document.querySelector('.close-btn');

  document.querySelectorAll('.view-info-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const backContent = e.target.closest('.flip-back-content');
      const title = backContent.querySelector('h2').innerText;
      const description = backContent.querySelector('p').innerText;
      
      document.getElementById('modal-title').innerText = title;
      document.getElementById('modal-description').innerText = description;
      modal.classList.remove('modal-hidden');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('modal-hidden');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('modal-hidden');
    }
  });
}