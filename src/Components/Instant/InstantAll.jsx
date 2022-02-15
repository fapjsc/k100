import { useContext } from "react";

// Redux
import { useDispatch } from "react-redux";

import { useHistory } from "react-router-dom";

// Context
import InstantContext from "../../context/instant/InstantContext";

// Components
import NoData from "../NoData";
import InstantAllItem from "./InstantAllItem";

// Actions
import { setCurrentInstantData } from "../../store/actions/instantActions";

// Style

const InstantAll = ({ stop }) => {
  const dispatch = useDispatch();

  // Route Props
  const history = useHistory();

  // Instant Context
  const instantContext = useContext(InstantContext);
  const { instantData, setCountData } = instantContext;

  const handleClick = (exRate, cny, usdt, type, token) => {
    stop();
    const data = {
      exRate,
      cny,
      usdt,
      type,
      token,
    };
    setCountData(data);
    dispatch(setCurrentInstantData(data));
    history.replace("/home/instant");
  };

  if (!instantData.length) {
    return <NoData />;
  } else {
    return (
      <div>
        {instantData.map((el) => {
          return (
            <InstantAllItem key={el.token} el={el} handleClick={handleClick} />
          );
        })}
      </div>
    );
  }
};

export default InstantAll;
