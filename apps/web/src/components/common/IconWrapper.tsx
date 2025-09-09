type IconWrapperProps = {
  size: number;
  children?: preact.ComponentChildren;
};

const IconWrapper = ({ size = 6, children }: IconWrapperProps) => {
  const sizeClass = `w-${size} h-${size}`;

  return (
    <div class={`flex items-center justify-center ${sizeClass}`}>
      {children}
    </div>
  );
};

export default IconWrapper;
