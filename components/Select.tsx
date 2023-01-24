import * as React from 'react';

type SelectProps = React.HTMLAttributes<HTMLSelectElement> & { disabled?: boolean; value: any;};

const Select =  React.forwardRef<HTMLSelectElement, SelectProps>( function Select({className, ...props}, ref)  {
    
    return (
        <select 
        className={"bg-white dark:bg-primary text-primary dark:text-white p-2 w-100 border-primary dark:border-gray-200 rounded-sm border border-solid " +( className || '')} {...props} ref={ref} />
    )
})

export default Select;
