import React, { useEffect, useRef, useState } from 'react';

const SeriesShowcase = () => {
  const [fullSerieActive, setFullSerieActive] = useState(false);
  const cardRefs = useRef([]);
  const episodeRefs = useRef([]);

  useEffect(() => {
    // Handle card hover events for video loading
    const handleCardHover = (cardIndex) => {
      const iframe = cardRefs.current[cardIndex]?.querySelector('iframe');
      if (iframe) {
        const videoSrc = iframe.getAttribute('data-video');
        iframe.setAttribute('src', videoSrc);

        // Unmute after 1 second (YouTube API would be needed for proper control)
        setTimeout(() => {
          // In a real implementation, you'd use YouTube API to unmute
          console.log('Video should unmute');
        }, 1000);
      }
    };

    const handleCardLeave = (cardIndex) => {
      const iframe = cardRefs.current[cardIndex]?.querySelector('iframe');
      if (iframe) {
        iframe.setAttribute('src', '');
      }
    };

    // Add hover event listeners to cards
    cardRefs.current.forEach((card, index) => {
      if (card) {
        const handleMouseEnter = () => handleCardHover(index);
        const handleMouseLeave = () => handleCardLeave(index);

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        // Store cleanup functions
        card._handleMouseEnter = handleMouseEnter;
        card._handleMouseLeave = handleMouseLeave;
      }
    });

    // Cleanup
    return () => {
      cardRefs.current.forEach((card) => {
        if (card && card._handleMouseEnter && card._handleMouseLeave) {
          card.removeEventListener('mouseenter', card._handleMouseEnter);
          card.removeEventListener('mouseleave', card._handleMouseLeave);
        }
      });
    };
  }, []);

  const handleViewClick = (seriesType) => {
    // Update episode backgrounds based on series type
    episodeRefs.current.forEach((episode) => {
      if (episode) {
        let backgroundUrl = '';
        switch (seriesType) {
          case 'lacasa':
            backgroundUrl = episode.getAttribute('data-lacasa');
            break;
          case 'got':
            backgroundUrl = episode.getAttribute('data-got');
            break;
          case 'vikings':
            backgroundUrl = episode.getAttribute('data-vikings');
            break;
          default:
            break;
        }
        if (backgroundUrl) {
          episode.style.background = `url(${backgroundUrl}) no-repeat center/cover`;
        }
      }
    });

    setFullSerieActive(true);
  };

  const handleCloseClick = () => {
    setFullSerieActive(false);
  };

  return (
    <section className="section series-showcase-section">
      <div className="fullscreen">
        <div className="container">
          <div className="card card_1" ref={(el) => (cardRefs.current[0] = el)}>
            <div className="date">
              11 June 2018
              <span className="tv_ico">
                <img src="http://www.cartaodental.com/nbase/image/pc.svg" alt="PC icon" />
              </span>
            </div>
            <div className="content">
              <div className="title">La Casa de Papel</div>
              <div className="text">
                The most watch series in 2018, don't you miss any episode on Netflix!
              </div>
            </div>
            <div className="sinopse">
              <iframe
                title="La Casa de Papel Trailer"
                type="text/html"
                data-video="https://www.youtube.com/embed/ZAXA1DV4dtI?autoplay=1&autohide=2&border=0&wmode=opaque&enablejsapi=1&modestbranding=1&controls=0&showinfo=1&mute=1"
                src=""
                frameBorder="0"
                allowFullScreen
              />
              <div className="content-sinopse">
                <div className="title">Series Synopsis</div>
                <div className="text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in hendrerit nulla, sed congue lorem. Phasellus sollicitudin tortor dui, id scelerisque ipsum ultrices vitae. Cras sed laoreet odio, vel ornare enim. Quisque porta quam at augue posuere, id luctus velit ullamcorper. Aenean sapien ligula, malesuada in mollis eu, vestibulum ut quam.
                </div>
              </div>
              <div className="view series_lacasa" onClick={() => handleViewClick('lacasa')}>
                Watch Full Series
              </div>
            </div>
          </div>

          <div className="card card_2" ref={(el) => (cardRefs.current[1] = el)}>
            <div className="date">
              16 April 2019
              <span className="tv_ico">
                <img src="http://www.cartaodental.com/nbase/image/pc.svg" alt="PC icon" />
              </span>
            </div>
            <div className="content">
              <div className="title">Game Of Thrones</div>
              <div className="text">
                For a lot of people the best series ever created, the most proud son of HBO!
              </div>
            </div>
            <div className="sinopse">
              <iframe
                title="Game of Thrones Trailer"
                type="text/html"
                data-video="https://www.youtube.com/embed/giYeaKsXnsI?autoplay=1&autohide=2&border=0&wmode=opaque&enablejsapi=1&modestbranding=1&controls=0&showinfo=1&mute=1"
                src=""
                frameBorder="0"
                allowFullScreen
              />
              <div className="content-sinopse">
                <div className="title">Series Synopsis</div>
                <div className="text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in hendrerit nulla, sed congue lorem. Phasellus sollicitudin tortor dui, id scelerisque ipsum ultrices vitae. Cras sed laoreet odio, vel ornare enim. Quisque porta quam at augue posuere, id luctus velit ullamcorper. Aenean sapien ligula, malesuada in mollis eu, vestibulum ut quam.
                </div>
              </div>
              <div className="view series_got" onClick={() => handleViewClick('got')}>
                Watch Full Series
              </div>
            </div>
          </div>

          <div className="card card_3" ref={(el) => (cardRefs.current[2] = el)}>
            <div className="date">
              22 October 2018
              <span className="tv_ico">
                <img src="http://www.cartaodental.com/nbase/image/pc.svg" alt="PC icon" />
              </span>
            </div>
            <div className="content">
              <div className="title">Vikings</div>
              <div className="text">
                One of the best series about Vikings and their way of living don't miss it!
              </div>
            </div>
            <div className="sinopse">
              <iframe
                title="Vikings Trailer"
                className="vikings"
                data-video="https://www.youtube.com/embed/9GgxinPwAGc?autoplay=1&autohide=2&border=0&wmode=opaque&enablejsapi=1&modestbranding=1&controls=0&showinfo=1&mute=1"
                type="text/html"
                src=""
                frameBorder="0"
                allowFullScreen
              />
              <div className="content-sinopse">
                <div className="title">Series Synopsis</div>
                <div className="text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in hendrerit nulla, sed congue lorem. Phasellus sollicitudin tortor dui, id scelerisque ipsum ultrices vitae. Cras sed laoreet odio, vel ornare enim. Quisque porta quam at augue posuere, id luctus velit ullamcorper. Aenean sapien ligula, malesuada in mollis eu, vestibulum ut quam.
                </div>
              </div>
              <div className="view series_vikings" onClick={() => handleViewClick('vikings')}>
                Watch Full Series
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`fullserie ${fullSerieActive ? 'active' : ''}`}>
        <div className="close" onClick={handleCloseClick}>
          <img src="http://www.cartaodental.com/nbase/image/close.svg" alt="Close" />
        </div>
        <div className="episodes">
          <div
            className="episode episode_1"
            ref={(el) => (episodeRefs.current[0] = el)}
            data-lacasa="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-616580.jpg"
            data-got="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-43195.jpg"
            data-vikings="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-504732.png"
          />
          <div
            className="episode episode_2"
            ref={(el) => (episodeRefs.current[1] = el)}
            data-lacasa="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-616580.jpg"
            data-got="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-43195.jpg"
            data-vikings="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-504732.png"
          />
          <div
            className="episode episode_3"
            ref={(el) => (episodeRefs.current[2] = el)}
            data-lacasa="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-616580.jpg"
            data-got="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-43195.jpg"
            data-vikings="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-504732.png"
          />
          <div
            className="episode episode_4"
            ref={(el) => (episodeRefs.current[3] = el)}
            data-lacasa="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-616580.jpg"
            data-got="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-43195.jpg"
            data-vikings="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-504732.png"
          />
          <div
            className="episode episode_5"
            ref={(el) => (episodeRefs.current[4] = el)}
            data-lacasa="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-616580.jpg"
            data-got="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-43195.jpg"
            data-vikings="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-504732.png"
          />
        </div>
      </div>
    </section>
  );
};

export default SeriesShowcase;