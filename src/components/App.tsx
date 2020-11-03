import React from 'react';
import TopMenu from "./TopMenu";
import Container from "./Container";

const App = () => {
  const [ currentContext, setCurrentContext ] = React.useState("game");

  const onMenuClick = (menu: string) => {
    setCurrentContext(menu);
  };

  return (
    <>
      <TopMenu onMenuClick={ onMenuClick }/>
      <Container context={currentContext}/>
    </>
  )
}

export default App;