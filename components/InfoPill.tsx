const InfoPill = ({ text, image }: { text: string; image: string }) => {
  return (
    <figure className="info-pill">
      <img src={image} alt={text} />
      <figcaption>{text}</figcaption>
    </figure>
  );
};

export default InfoPill;
