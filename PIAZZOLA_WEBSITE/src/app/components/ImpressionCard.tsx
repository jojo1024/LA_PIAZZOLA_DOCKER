import React from 'react';
import FormCheck from './FormCheck';
// import { FormCheck } from '../../base-components/Form';

interface ImpressionCardProps {
    id: string;
    title: string;
    subTitle: string;
    radioName?: string;
    radioValue?: string;
    svgIcon: JSX.Element;
    isSelected: boolean;
    onClick: () => void;
}

const ImpressionCard: React.FC<ImpressionCardProps> = ({
    id,
    title,
    subTitle,
    svgIcon,
    isSelected,
    onClick
}) => {
    return (
        <div
            onClick={onClick}
            className={`mr-auto cursor-pointer mb-3 h-[105px] md:h-[85px] border-solid border-2   rounded-lg p-2 ${isSelected ? 'bg-[#F9F5FF] dark:bg-[#232d45]  text-primary border-primary' : ''}`}
        >
            <div className='flex'>

                <div className=''>
                    {svgIcon}
                </div>
                <div className="flex-1 py-1 ml-2 ">

                    <div className="flex  items-center">
                        <div className="font-medium">
                            {title}

                        </div>
                        <div className="ml-auto text-xs   text-slate-500">
                            <FormCheck.Input
                                className=''
                                // id="radio-switch-1"
                                type="radio"
                                // name={radioName}
                                value={id}
                                checked={isSelected}
                                onChange={onClick}
                            />
                        </div>
                    </div>
                    <div className="mt-1  text-xs text-slate-500">
                        {subTitle}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ImpressionCard;
