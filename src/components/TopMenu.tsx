import React from "react";
import "../css/topmenu.css"

const TopMenu = (props: { onMenuClick: (menu: string) => void }) => {
  const { onMenuClick } = props;

  const menues = [
    { id: "game", text: "게임",  },
    { id: "event", text: "이벤트",  },
    { id: "security",  text: "보안센터" },
  ];

  return (<div className="topmenu">
    <span className="menuitem"><img src="./img/logo.svg" alt="NEXON" /></span>
    {menues.map((menu, i) => <span className="menuitem" key={"menu-item-key-" + i+1} >
      <button
      className="menuitem" 
      onClick={() => onMenuClick(menu.id)}>
        {menu.text}
      </button>
    </span>)}
  </div>);
}

export default TopMenu;