import React from 'react';
import Games from "./Games";
import "../css/container.css";


const Container = (props: { context: string }) => {
  const { context } = props;
  return (
    <div className="container">
      {
        context === "game" ? <Games /> 
        : context === "event" ? <></>
        : context === "security" ? <></>
        : null
      }
    </div>
  )
}

export default Container;