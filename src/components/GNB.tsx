import React from "react";

const GNB = () => {
  const menues = [
    { name: "홈", link: "." },
    { name: "게임", link: "." },
    { name: "새소식", link: "." },
    { name: "보안센터", link: "." },
  ];




  return (
    <div id="gnbSec">
      <h1>
        <a>
          <img src="./img/logo.svg" alt="NEXON" />
        </a>
      </h1>
      <ul id="topNav">
        {menues.map((menu, i) => {
          return <li key={`topnav-menu-${i}`}><a href={menu.link}>{menu.name}</a></li>
        })}
      </ul>
    </div>
  )
}

export default GNB;