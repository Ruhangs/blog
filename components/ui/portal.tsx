import { type ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Portal = ({
  children,
  containerId,
}: {
  children: ReactNode;
  containerId: string;
}) => {
  const [container, setContainer] = useState<HTMLElement>();

  useEffect(() => {
    setContainer(document.getElementById(containerId)!);
  }, [containerId]);

  return container ? ReactDOM.createPortal(children, container) : null;
};

export default Portal;
