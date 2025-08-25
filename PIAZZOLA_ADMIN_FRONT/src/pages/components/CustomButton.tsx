import clsx from 'clsx';
import React from 'react';
import Button from '../../base-components/Button';
import LoadingIcon from '../../base-components/LoadingIcon';
import Lucide from '../../base-components/Lucide';

export interface ILoadingButtonProps {
  libelle?: string;
  loading?: boolean;
  disable?: boolean;
  onClick?: any;
  refs?: React.MutableRefObject<null>;
  iconLabel?: string;
  className?: string;
  type?: "danger" | "warning" | "primary" | "secondary" | "third" | "soft-primary";
  libelleClassName?: string;
  buttonWithConfirmation?: boolean;
}

const CustomButton: React.FC<ILoadingButtonProps> = ({
  libelle,
  loading = false,
  disable = false,
  onClick,
  refs,
  iconLabel,
  className,
  type = "primary",
  libelleClassName
}) => {
  // Détermine les classes pour le bouton en fonction de l'état
  const buttonClasses = clsx(
    ` ${disable ? 'cursor-not-allowed' : ''}`,
    { "!box text-slate-600 dark:text-slate-300": !disable && type === "third" },
    className
  );

  // Détermine les classes pour le libellé
  const libelleClasses = clsx(
    { "ml-2": iconLabel },
    libelleClassName
  );

  return (
    <>
      <Button
        ref={refs}
        variant={disable ? "secondary" : type === "third" ? undefined : type}
        className={buttonClasses}
        disabled={disable || loading}
        onClick={onClick}
        type='submit'
      >
        {iconLabel &&
          // @ts-ignore
          <Lucide icon={iconLabel} className="w-4 h-4" />}
        {libelle && <span className={libelleClasses}>{libelle}</span>}
        {loading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
      </Button>
    </>
  );
};

export default CustomButton;
