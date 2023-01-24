import * as React from 'react';

type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & { disabled?: boolean; type?: string };

const Button =  React.forwardRef<HTMLButtonElement, ButtonProps>( function Button({className, ...props}, ref)  {
    
    return (
        <button className={"bg-primary hover:shadow-btnShadow disabled:opacity-[0.5] dark:hover:shadow-btnDarkShadow text-white dark:bg-secondary dark:text-primary py-[11px] px-[18px] hover:transition-all " +( className || '')} {...(props as any)} ref={ref} />
    )
})

export default Button;
