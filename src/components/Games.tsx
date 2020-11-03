import React, { useState } from "react";

const Games = () => {
  interface GameInfo {
    title: string;
    image: string;
    genre: string;
    link: string;
  }

  const games: GameInfo[] = [
    {
      title: "바람의 나라 연",
      image: "https://rs.nxfs.nexon.com/gameusr/19/7/vxrp02155220964.png",
      genre: "MMORPG",
      link: "https://baramy.nexon.com/?channel=2101",
    }, {
      title: "카트라이더 러쉬플러스",
      image: "https://rs.nxfs.nexon.com/gameusr/20/4/jZaM03182411854.png",
      genre: "레이싱",
      link: "https://kartrush.nexon.com",
    }, {
      title: "EA SPORTS™ FIFA Mobile",
      image: "https://rs.nxfs.nexon.com/gameusr/20/9/snsT24092900255.png",
      genre:"스포츠",
      link: "https://fifamobile.nexon.com/",
    }, {
      title: "V4",
      image: "https://rs.nxfs.nexon.com/gameusr/19/8/mQVi30152325998.png",
      genre:"MMORPG",
      link: "https://v4.nexon.com/",
    }
  ]

  const [ selected, select ] = useState(0);
  const [ isRunning, setRunning ] = useState(false);
  const [ isLoaded, setLoaded ] = useState(false);

  const runGame = () => {
    setRunning(true);
    window.__ICP__.sendMessage("app/RUN");
  };

  const selectGame = (index: number) => {
    select(index);
    setLoaded(false);
  }

  return <>
    <div className="content">
      <iframe src={games[selected].link} width="100%" height="100%" onLoad={() => setLoaded(true)}/>
      { isLoaded ? <button className="run" onClick={runGame}>게임 실행</button> : null }
    </div>
    <div className="sidebar">
      <ul> 
        {games.map((game, i) => (
          <li key={"game-list-"+i}>
            <a onClick={() => selectGame(i)} className="game">
              <span>
                <img className="game-image" src={game.image} alt={game.title}></img>
              </span>
              <span className="title">{game.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
    { isRunning ? <div className="blocker">
      <div className="blocker-message">게임실행중입니다</div>
      </div>
      : null
    }
  </>;
}

export default Games;