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
  width: 400px;
  height: 100vh;
  align-items: center;
  text-align: center;
  font-family: "Ramche";
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
  width: 300px;
  height: 180px;
  border: 3px solid #ffffff;
`;

const SidebarFooter = styled.div`
  margin-top: 50px;
`;

function Sidebar() {
  const menus = [
    { name: "홈", path: "roomlist" },
    { name: "랭킹", path: "ranking" },
    { name: "설정", path: "setting" },
  ];

  return (
    <SideBarWrapper>
      <TitleHeader>Put Your Hands Up</TitleHeader>
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
        <img src="/tetris.gif" />
      </SidebarFooter>
    </SideBarWrapper>
  );
}

export default Sidebar;
