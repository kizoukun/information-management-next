import React from 'react';

const HeaderCard = ({ title, value, desc, percentage }) => {
    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
            <div className="flex-auto p-4">
                <div className="flex flex-wrap">
                    <div className="relative  w-full pr-4 max-w-full flex-grow flex-1">
                        <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                            {title}
                        </h5>
                        <span className="font-semibold text-xl text-blueGray-700">
                            {value}
                        </span>
                    </div>
                    <div className="relative w-auto pl-4 flex-initial">
                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-red-500">
                            <i className="far fa-chart-bar"></i>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-blueGray-400 mt-4">
                    <span className="text-emerald-500 mr-2">
                        <i className="fas fa-arrow-up"></i> {percentage}%
                    </span>
                    <span className="whitespace-nowrap">
                        {desc}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default HeaderCard;
