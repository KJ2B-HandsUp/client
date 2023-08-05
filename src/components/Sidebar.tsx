import { NavLink } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import { SidebarWrapper } from "../styled/sidebar.styled";
import { SidebarProps } from "../types/sidebar.type";

function Sidebar({ items }: SidebarProps) {
  return (
    <SidebarWrapper>
      {items.map((item, index) => {
        return (
          <NavLink
            to={`/main/${item.path}`}
            key={index}
            style={({ isActive }) => {
              return {
                textDecoration: "none",
              };
            }}
          >
            <SidebarItem menu={item} />
          </NavLink>
        );
      })}
    </SidebarWrapper>
  );
}

export default Sidebar;
