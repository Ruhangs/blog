import React from 'react';

interface propsType {
  title: string;
  type: string;
  info: Record<string, unknown>;
}

// interface infoType {
//   string: number;
// }

export const Card = ({ title, type, info }: propsType) => {
  console.log(info);
  return (
    <div className="border bg-card text-card-foreground rounded-lg p-6">
      <div className="flex items-center justify-between pb-2">
        <h3 className="tracking-tight font-bold">{title}</h3>
        <h3 className="tracking-tight font-bold">{type}</h3>
      </div>
      <ul className="max-h-60 overflow-y-auto scrollbar pr-1">
        {info ? (
          Object.keys(info).map((key) => {
            return (
              <li key={key}>
                <div className="flex items-center justify-between">
                  <span>{key}</span>
                  <span className=" font-semibold">{info[key] as number}</span>
                </div>
              </li>
            );
          })
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
};
