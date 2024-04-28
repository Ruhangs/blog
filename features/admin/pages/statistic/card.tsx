import React from 'react';

interface propsType {
  title: string;
  type: string;
  info: infoType[];
}

interface infoType {
  x: string;
  y: number;
}

export const Card = ({ title, type, info }: propsType) => {
  return (
    <div className="border bg-card text-card-foreground rounded-lg p-6">
      <div className="flex items-center justify-between pb-2">
        <h3 className="tracking-tight font-bold">{title}</h3>
        <h3 className="tracking-tight font-bold">{type}</h3>
      </div>
      <ul className="max-h-60 overflow-y-auto scrollbar pr-1">
        {info.map((el) => (
          <li key={el.x}>
            <div className="flex items-center justify-between">
              <span>{el.x === '' ? '未知' : el.x}</span>
              <span className=" font-semibold">{el.y}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
