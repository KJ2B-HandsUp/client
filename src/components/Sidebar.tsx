import { NavLink } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import styled from "styled-components";

const Side = styled.div`
  display: flex;
  border-right: 1px solid #e0e0e0;
  flex-direction: column;
  align-items: center;
  width: 300px;
  height: 100vh;
`;

function Sidebar() {
  const menus = [
    { name: "홈", path: "roomlist" },
    { name: "랭킹", path: "ranking" },
    { name: "설정", path: "setting" },
  ];

  return (
    <Side>
      <h2>Put Your Hands Up</h2>
      {menus.map((menu, index) => {
        return (
          <NavLink
            to={menu.path}
            key={index}
            style={({ isActive }) => {
              return {
                fontWeight: isActive ? "bold" : "",
                color: isActive ? "black" : "gray",
                textDecoration: "none",
              };
            }}
          >
            <SidebarItem menu={menu} />
          </NavLink>
        );
      })}
    </Side>
  );
}

export default Sidebar;
