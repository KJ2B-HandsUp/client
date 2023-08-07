import { NavLink } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import { SidebarWrapper } from "../styled/sidebar.styled";
import { SidebarProps } from "../types/sidebar.type";
import { playBtnAudio } from "../utils/audio";

function Sidebar({ items }: SidebarProps) {
  return (
    <SidebarWrapper>
      {items.map((item, index) => {
        return (
          <NavLink
            to={`/main/${item.path}`}
            key={index}
            onClick={playBtnAudio}
            style={{
              textDecoration: "none",
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
