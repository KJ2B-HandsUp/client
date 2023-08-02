import { NavLink } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import styled from "styled-components";

const SideBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  background-color: #212529;
  border-right: 2px solid #e0e0e0;
  box-shadow: 0px 0px 10px 0px;
  top: 0;
  left: 0;
  width: 20vw;
  height: 100vh;
  align-items: center;
  text-align: center;
  font-size: 40px;
  overflow: auto;
  z-index: 100000;
`;

const TitleHeader = styled.div`
  italic: true;
  color: #ffffff;
  margin-top: 50px;
  margin-bottom: 50px;
  font-size: 50px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 19vw;
  height: 15vh;
  border: 3px solid #ffffff;
`;

const SidebarFooter = styled.div`
  margin-top: 50px;
`;

function Sidebar() {
  const menus = [
    { name: "Home", path: "roomlist" },
    { name: "Ranking", path: "ranking" },
    { name: "Setting", path: "setting" },
  ];

  return (
    <SideBarWrapper>
      <TitleHeader>Hands Up</TitleHeader>
      {menus.map((menu, index) => {
        return (
          <NavLink
            to={menu.path}
            key={index}
            style={({ isActive }) => {
              return {
                fontWeight: isActive ? "bold" : "",
                color: isActive ? "white" : "gray",
                textDecoration: "none",
                marginTop: "30px",
              };
            }}
          >
            <SidebarItem menu={menu} />
          </NavLink>
        );
      })}
      <SidebarFooter>
        <div></div>
      </SidebarFooter>
    </SideBarWrapper>
  );
}

export default Sidebar;
