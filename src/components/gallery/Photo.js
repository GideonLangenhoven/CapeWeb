import React from 'react';

const Photo = ({ photo, onOpenModal }) => {
  const handlePhotoClick = () => {
    onOpenModal(photo);
  };

  return (
    <figure onClick={handlePhotoClick}>
      <img src={photo.imageUrl} alt={photo.title} />
      <figcaption>
        <h3>{photo.title}</h3>
        <p>{photo.description}</p>
      </figcaption>
    </figure>
  );
};

export default Photo;