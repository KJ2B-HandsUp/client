import { NavLink } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import styled from "styled-components";

const Side = styled.div`
  position: fixed;
  display: flex;
  background-color: #212529;
  border-right: 2px solid #e0e0e0;
  flex-direction: column;
  width: 400px;
  height: 100vh;
  box-shadow: 0px 0px 10px 0px;
  align-items: center;
  text-align: center;
  font-family: "Ramche";
  z-index: 100000;
  top: 0;
  left: 0;
  overflow: auto;
`;

const TitleHeader = styled.div`
  italic: true;
  color: #ffffff;
  margin-top: 50px;
  margin-bottom: 50px;
  font-size: 50px;
  font-weight: 700;
`;

const SideBarWrapper = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  height: 100vh;
`;

function Sidebar() {
  const menus = [
    { name: "홈", path: "roomlist" },
    { name: "랭킹", path: "ranking" },
    { name: "설정", path: "setting" },
  ];

  return (
    <SideBarWrapper>
      <Side>
        <TitleHeader>Put Your Hands Up</TitleHeader>
        {menus.map((menu, index) => {
          return (
            <NavLink
              to={menu.path}
              key={index}
              style={({ isActive }) => {
                return {
                  border: "2px solid white",
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
      </Side>
    </SideBarWrapper>
  );
}

export default Sidebar;
