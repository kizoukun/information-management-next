import React from 'react';

const CustomCard = ({ title, value, desc, date }) => {
  return (
    <div className="card bg-white hover:translate-y-1 duration-200 hover:shadow-md rounded-lg h-48 min-w-48 max-w-48 py-5 px-8 grid gap-1 relative shadow-xl">
      <div className="bg-white w-full h-8 block overflow-hidden">
        <h1 className="text-2xl font-semibold ">{title}</h1>
      </div>
      <h1 className="text-2xl text-green-600 font-bold">{value}</h1>
      <div className="max-h-12 overflow-hidden">
        <p className="text-xs text-slate-600">{desc}</p>
      </div>
      <p className="text-xs">{date}</p>
      <div className="bg-white">
        <button className="absolute  top-1 right-1 text-sm font-semibold p-1 rounded-xl brightness-95 hover:brightness-100">
          <svg
            className="mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            viewBox="0 0 24 24">
            <rect width="24" height="24" fill="none" />
            <g
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2">
              <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
              <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3" />
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CustomCard;
