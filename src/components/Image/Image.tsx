type ImageProps = {
  src: string;
  alt: string;
};

export const Image = (props: ImageProps) => {
  const { src, alt } = props;
  return <img src={src} alt={alt} />;
};
