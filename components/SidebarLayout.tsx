import * as React from 'react';
import Logo from '../assets/png/clipp_logo.png';
import Image from 'next/image';
import Link from 'next/link';

const items = [
    // {item: '', label: 'Dashboard'},
   {item: 'polling_unit', label: 'Polling Unit' },
   {item: 'lga', label: 'LGA'},
   {item: 'create_polling_unit', label: 'Create Unit'}

]

const SideBar: React.FC<{ active: string, children?: any }> = ({ children, active }) => {
    return (
        <div className="max-w-8xl px-4 sm:px-6 md:px-8 my-0 mx-auto">
            <div className="hidden lg:flex flex-col justify-center fixed z-20 inset-0 top-[3.8125rem] left-[max(0px,calc(50%-45rem))] right-auto w-[19.5rem] pb-10 px-8 overflow-y-auto">
                <nav className="lg:text-sm lg:leading-6 relative">
                    <ul className="space-y-6 lg:space-y-2 border-l border-slate-100 dark:border-slate-800">
                    <li className="py-2 text-lg">
                                <Link href={`/dashboard`} className={"block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300" + ((active == '') ? ' text-blue-ink font-bold' : '')}>
                                    Dashboard
                                </Link>
                            </li>
                        {items.map(({item, label}, index) =>{
                            const isActive = active === item;
                           return (
                            <li key={`sidebar-link-${index}`} className="py-2 text-lg">
                                <Link href={`/modules/${item}`} className={"block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300" + (isActive ? ' text-blue-ink font-bold' : '')}>
                                    {label}
                                </Link>
                            </li>
                        )})}
                    </ul>
                </nav>
            </div>
            <div className="lg:pl-[19.5rem]">
                <div className="logo-container py-3">
                    <div className="logo-div inline-block p-2 bg-otherColor">
                        <h4 className="w-[140px] h-[50px]">Polls</h4>
                    </div>
                </div>
                {children}
            </div>

        </div>
    )
}
export default SideBar;

export function WithSideBar(Component: React.FC<any>, active: string) {
    return function Returned(props: any)  {
    return <SideBar active={active}>
        {Component(props)}
    </SideBar>
}
}
