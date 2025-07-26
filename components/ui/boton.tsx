import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'bg-[#63B23D] hover:bg-[#4b8f2f] text-white text-base font-bold py-2 rounded-xl transition duration-200',
        className,
      )}
    >
      {children}
    </button>
  );
}